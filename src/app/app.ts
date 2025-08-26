import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ModEngine } from './services/mod-engine';
import { BlockUIModule } from 'primeng/blockui';
import { CommonService } from './services/common-service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlockUIModule, AsyncPipe, ProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly modEngineService = inject(ModEngine);
  protected readonly commonService = inject(CommonService);
  private readonly router = inject(Router);
  iframeRef = viewChild.required<ElementRef<HTMLIFrameElement>>('sandbox');
  private modLoadingTexts = [
    "Unleashing the mod...",
    "Warming up the mod engines...",
    "Running the mod at full speed...",
    "Executing the mod's plan...",
    "Processing the mod's magic...",
    "Pushing the mod into action...",
    "Powering through the mod's tasks...",
    "The mod is on an adventure...",
    "The mod is exploring uncharted code...",
    "The mod is racing through functions..."
  ];
  currentLoadingText = signal('');
  isLoadingPage = signal(false);
  constructor() {
    this.modEngineService.modIsRunning$.pipe(takeUntilDestroyed()).subscribe(isRunning => {
      if (isRunning) {
        const randomIndex = Math.floor(Math.random() * this.modLoadingTexts.length);
        this.currentLoadingText.set(this.modLoadingTexts[randomIndex]);
      } else {
        this.currentLoadingText.set('Please Wait...');
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoadingPage.set(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoadingPage.set(false);
      }
    });
  }


  ngAfterViewInit() {
    this.modEngineService.initSandBox(this.iframeRef().nativeElement);
  }
}
