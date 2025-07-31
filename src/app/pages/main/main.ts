import { Component, model, signal } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { PasteOptions } from "../../components/paste-options/paste-options";
import { TextareaModule } from 'primeng/textarea';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { themeName } from '../../editor-theme';
import { ModsContainer } from "../../components/mods-container/mods-container";

@Component({
  selector: 'app-main',
  imports: [FieldsetModule, PasteOptions, TextareaModule, MonacoEditorModule, ModsContainer],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  pasteEditorOptions = {
    theme: themeName,
    language: 'plaintext',
    automaticLayout: true,
    minimap: { enabled: false },
  };
  resultEditorOptions = {
    ...this.pasteEditorOptions,
    readOnly: true,
  };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  showContent = model(true)
}
