import { signal } from "@angular/core";

export class ModRunOptions {
  multipleMode = signal(false);
  autoCopy = signal(true);
  inputCount = signal(1);
}
