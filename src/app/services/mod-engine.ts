import { inject, Injectable } from '@angular/core';
import { getJsRunnerCode } from '../constants/js-runner-code';
import { ESandboxResultTypes } from '../enums/mod-results.enum';
import { BehaviorSubject, filter, fromEvent, Subject, Subscription, take, takeUntil } from 'rxjs';
import { CommonService } from './common-service';
import { globalModRunOptions } from '../models/mod-run-options.model';

@Injectable({
  providedIn: 'root'
})
export class ModEngine {

  private readonly commonService = inject(CommonService);

  sandBoxRef: HTMLIFrameElement | null = null;
  sandBoxMessage$ = fromEvent<MessageEvent>(window, 'message');
  private stopListening$ = new Subject<void>();
  modIsRunning$ = new BehaviorSubject<boolean>(false);
  modRunningSummary$ = new BehaviorSubject<{
    duration: string,
    success: boolean,
    error: string | null,
  } | null>(null);
  modRunStartTime: number | null = null;

  initSandBox(iframeElement: HTMLIFrameElement) {
    this.sandBoxRef = iframeElement;
  }

  runJsCode(code: string, inputs: string[], noDev = false) {
    return new Promise<string>((resolve, reject) => {
      if (!this.sandBoxRef) {
        console.log('Sandbox not initialized');
        return reject(new Error('Mod not initialized'));
      }
      this.sandBoxRef.onerror = (error) => {
        console.log('Error loading sandbox:', error);
        this.cleanup();
        reject(error);
        if (noDev) {
          this.setModRunSummary(false, 'An error occurred while loading the sandbox');
        }
      };
      const timer = setTimeout(() => {
        reject(new Error('Mod execution timed out'));
        this.cleanup();
        if (noDev) {
          this.setModRunSummary(false, 'Mod execution timed out');
        }
      }, 5000); // Wait for the script to execute
      fromEvent<MessageEvent>(window, 'message').pipe(
        takeUntil(this.stopListening$),
        filter(e => !!e?.data?.type),
        take(1)
      ).subscribe((e) => {
        console.log("Sandboxed return:", e.data);
        if (!e.data || !e.data.type) return;
        if (e.data.type === ESandboxResultTypes.MOD_RESULT) {
          clearTimeout(timer);
          resolve(e.data.data);
          if (noDev) {
            this.setModRunSummary(true, null);
          }
        } else if (e.data.type === ESandboxResultTypes.MOD_ERROR) {
          clearTimeout(timer);
          reject(new Error(e.data.data));
          if (noDev) {
            this.setModRunSummary(false, e.data.data || 'An error occurred while executing the mod code');
          }
        } else {
          clearTimeout(timer);
          console.log('Unknown message type:', e.data.type);
          reject(new Error(!noDev ? ('Unknown message type: ' + (e.data.type || 'N/A')) : 'Something went wrong'));
          if (noDev) {
            this.setModRunSummary(false, 'Unknown message type: ' + (e.data.type || 'N/A'));
          }
        }
        this.cleanup();
      });
      this.commonService.setLoading(true);
      this.modIsRunning$.next(true);
      this.modRunStartTime = Date.now();
      this.sandBoxRef.srcdoc = `
        <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js"></script>
        <script>${getJsRunnerCode(code, inputs, globalModRunOptions.multipleMode(), noDev)}</script>
      `;
    });
  }

  killSandBox() {
    if (this.sandBoxRef) {
      this.sandBoxRef.srcdoc = 'about:blank';
    }
  }

  cleanup() {
    // this.killSandBox();
    this.stopListening$.next();
    this.commonService.setLoading(false);
    this.modIsRunning$.next(false);
  }

  setModRunSummary(success: boolean, error: string | null) {
    const totalDuration = Date.now() - (this.modRunStartTime || Date.now());
    this.modRunningSummary$.next({
      duration: totalDuration > 1000 ? `${(totalDuration / 1000).toFixed(2)} seconds` : `${totalDuration} ms`,
      success,
      error
    });
    this.modIsRunning$.next(false);
    this.modRunStartTime = null;
  }
}
