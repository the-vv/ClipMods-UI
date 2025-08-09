import { Component, model, signal } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { PasteOptions } from "../../components/paste-options/paste-options";
import { TextareaModule } from 'primeng/textarea';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { themeName } from '../../editor-theme';
import { ModsContainer } from "../../components/mods-container/mods-container";
import { ModRunOptions } from '../../models/mod-run-options.model';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [FieldsetModule, PasteOptions, TextareaModule, MonacoEditorModule, ModsContainer, FormsModule, NgClass],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
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
  modRunOptions: ModRunOptions = new ModRunOptions();
  inputArgs = signal<string[]>(['']);

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

}
