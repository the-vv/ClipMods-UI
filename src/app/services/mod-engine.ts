import { Injectable } from '@angular/core';
import { getJsRunnerCode } from '../constants/js-runner-code';
import { ESandboxResultTypes } from '../enums/mod-results.enum';
import { fromEvent, Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModEngine {

  sandBoxRef: HTMLIFrameElement | null = null;
  sandBoxMessage$ = fromEvent<MessageEvent>(window, 'message');

  initSandBox(iframeElement: HTMLIFrameElement) {
    this.sandBoxRef = iframeElement;
  }

  runJsCode(code: string, inputs: string[]) {
    return new Promise<string>((resolve, reject) => {
      if (!this.sandBoxRef) {
        console.log('Sandbox not initialized');
        return;
      }
      this.sandBoxRef.onerror = (error) => {
        console.log('Error loading sandbox:', error);
        reject(error);
      };
      const timer = setTimeout(() => {
        reject(new Error('Sandbox execution timed out'));
        this.cleanup();
      }, 3000); // Wait for the script to execute
      fromEvent<MessageEvent>(window, 'message').pipe(take(1)).subscribe((e) => {
        console.log("Sandboxed return:", e.data);
        if (e.data.type === ESandboxResultTypes.MOD_RESULT) {
          clearTimeout(timer);
          resolve(e.data.data);
        } else if (e.data.type === ESandboxResultTypes.MOD_ERROR) {
          clearTimeout(timer);
          reject(new Error(e.data.data));
        } else {
          console.log('Unknown message type:', e.data.type);
          this.killSandBox();
          reject(new Error('Unknown message type: ' + e.data.type));
        }
        this.cleanup();
      });
      this.sandBoxRef.srcdoc = `
        <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js"></script>
        <script>${getJsRunnerCode(code, inputs)}</script>
      `;
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
  }
}
