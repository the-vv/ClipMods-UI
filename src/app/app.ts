import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModEngine } from './services/mod-engine';
import { BlockUIModule } from 'primeng/blockui';
import { CommonService } from './services/common-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlockUIModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  private readonly modEngineService = inject(ModEngine);
  protected readonly commonService = inject(CommonService);
  iframeRef = viewChild.required<ElementRef<HTMLIFrameElement>>('sandbox');

  ngAfterViewInit() {
    this.modEngineService.initSandBox(this.iframeRef().nativeElement);
  }
}
