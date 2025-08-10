import { Component, effect, inject, model, signal } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { PasteOptions } from "../../components/paste-options/paste-options";
import { TextareaModule } from 'primeng/textarea';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { themeName } from '../../editor-theme';
import { ModsContainer } from "../../components/mods-container/mods-container";
import { ModRunOptions } from '../../models/mod-run-options.model';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ModService } from '../../services/mod-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModEngine } from '../../services/mod-engine';
import { Toaster } from '../../classes/toster';
import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";
import { CommonService } from '../../services/common-service';

@Component({
  selector: 'app-main',
  imports: [FieldsetModule, PasteOptions, TextareaModule, MonacoEditorModule, ModsContainer, FormsModule, NgClass, Dialog, Button],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

  private readonly modService = inject(ModService);
  private readonly modEngineService = inject(ModEngine);
  private readonly commonService = inject(CommonService);

  pasteEditorOptions = {
    theme: themeName,
    language: 'plaintext',
    automaticLayout: true,
    alwaysConsumeMouseWheel: false,
    minimap: { enabled: false },
  };
  resultEditorOptions = {
    ...this.pasteEditorOptions,
    readOnly: true,
  };
  modErrDialogConfig = signal({
    visible: false,
    error: ''
  })
  modRunOptions: ModRunOptions = new ModRunOptions();
  inputArgs = signal<string[]>(['']);
  result = signal<string>('');

  constructor() {
    effect(() => {
      this.modService.currentInputLength.set(this.modRunOptions.inputCount());
    })
    this.modService.triggerModWithId$.pipe(takeUntilDestroyed()).subscribe(modId => {
      this.result.set('');
      const allEmpty = this.inputArgs().every(arg => (arg || '').trim() === '');
      if (allEmpty) {
        Toaster.showError('Please provide input arguments to run the mod');
        return;
      }
      this.commonService.setLoading(true);
      this.modService.getModelById(modId).then(mod => {
        this.commonService.setLoading(false);
        this.modEngineService.runJsCode(mod.code, this.inputArgs(), true).then(result => {
          this.modResult(result);
        }).catch(error => {
          this.commonService.setLoading(false);
          this.modErrDialogConfig.set({
            visible: true,
            error: error.message || 'An error occurred while executing the mod code'
          });
        });
      }).catch(error => {
        console.error('Error loading mod:', error);
        Toaster.showError('Failed to load mod');
      });
    })
  }

  getIterableOf(count: number) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  inputCountChanged() {
    const currentInputArgs = this.inputArgs();
    const requiredCount = this.modRunOptions.inputCount();
    if (currentInputArgs.length < requiredCount) {
      this.inputArgs.set([...currentInputArgs, ...Array(requiredCount - currentInputArgs.length).fill('')]);
    }
    else if (currentInputArgs.length > requiredCount) {
      this.inputArgs.set(currentInputArgs.slice(0, requiredCount));
    }
  }

  onInitInputEditor(editorInstance: any) {
    editorInstance.updateOptions({ alwaysConsumeMouseWheel: false });
  }

  onOptionChanged(event: { key: keyof ModRunOptions, value: any }) {
    if (event.key === 'inputCount') {
      this.inputCountChanged();
    }
  }
  closeErrorDialog() {
    this.modErrDialogConfig.set({
      ...this.modErrDialogConfig(),
      visible: false,
      // error: ''
    });
  }

  modResult(result: string) {
    this.result.set(result);
    if (this.modRunOptions.autoCopy()) {
      navigator.clipboard.writeText(result).then(() => {
        Toaster.showSuccess('Mod executed successfully and result copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy result:', err);
        Toaster.showError('Failed to copy result to clipboard');
      });
    } else {
      Toaster.showSuccess('Mod executed successfully');
    }
  }
}
