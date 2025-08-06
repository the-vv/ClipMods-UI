import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModEngine } from './services/mod-engine';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  private readonly modEngineService = inject(ModEngine);
  iframeRef = viewChild.required<ElementRef<HTMLIFrameElement>>('sandbox');

  ngAfterViewInit() {
    this.modEngineService.initSandBox(this.iframeRef().nativeElement);
  }
}
