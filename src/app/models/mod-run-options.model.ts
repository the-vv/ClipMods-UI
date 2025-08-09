import { signal } from "@angular/core";

export class ModRunOptions {
  multipleMode = signal(false);
  autoCopy = signal(false);
  inputCount = signal(1);
}
