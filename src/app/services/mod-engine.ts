import { inject, Injectable } from '@angular/core';
import { getJsRunnerCode } from '../constants/js-runner-code';
import { ESandboxResultTypes } from '../enums/mod-results.enum';
import { BehaviorSubject, fromEvent, Subject, Subscription, take, takeUntil } from 'rxjs';
import { CommonService } from './common-service';

@Injectable({
  providedIn: 'root'
})
export class ModEngine {

  private readonly commonService = inject(CommonService);

  sandBoxRef: HTMLIFrameElement | null = null;
  sandBoxMessage$ = fromEvent<MessageEvent>(window, 'message');
  private stopListening$ = new Subject<void>();
  modIsRunning$ = new BehaviorSubject<boolean>(false);

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
      };
      const timer = setTimeout(() => {
        reject(new Error('Mod execution timed out'));
        this.cleanup();
      }, 5000); // Wait for the script to execute
      fromEvent<MessageEvent>(window, 'message').pipe(takeUntil(this.stopListening$), take(1)).subscribe((e) => {
        console.log("Sandboxed return:", e.data);
        if (e.data.type === ESandboxResultTypes.MOD_RESULT) {
          clearTimeout(timer);
          resolve(e.data.data);
        } else if (e.data.type === ESandboxResultTypes.MOD_ERROR) {
          clearTimeout(timer);
          reject(new Error(e.data.data));
        } else {
          clearTimeout(timer);
          console.log('Unknown message type:', e.data.type);
          reject(new Error(!noDev ? ('Unknown message type: ' + (e.data.type || 'N/A')) : 'Something went wrong'));
        }
        this.cleanup();
      });
      this.sandBoxRef.srcdoc = `
        <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js"></script>
        <script>${getJsRunnerCode(code, inputs, noDev)}</script>
      `;
      this.commonService.setLoading(true);
      this.modIsRunning$.next(true);
    });
  }

  killSandBox() {
    if (this.sandBoxRef) {
      this.sandBoxRef.srcdoc = 'about:blank';
      console.log('Sandbox killed');
    }
  }

  cleanup() {
    this.killSandBox();
    this.stopListening$.next();
    this.commonService.setLoading(false);
    this.modIsRunning$.next(false);
  }
}
