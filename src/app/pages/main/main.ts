import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { PasteOptions } from "../../components/paste-options/paste-options";
import { TextareaModule } from 'primeng/textarea';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { themeName } from '../../editor-theme';

@Component({
  selector: 'app-main',
  imports: [FieldsetModule, PasteOptions, TextareaModule, MonacoEditorModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  editorOptions = { theme: themeName, language: 'javascript', automaticLayout: true };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
}
