import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { clipModsPreset } from './clipMods.theme';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { setMonacoTheme } from './editor-theme';
import { ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: clipModsPreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    importProvidersFrom(MonacoEditorModule.forRoot({
      baseUrl: `${window.location.origin}/public/monaco/min/vs`,
      onMonacoLoad: () => {
        setMonacoTheme();
      },
    })),
    ConfirmationService
  ]
};
