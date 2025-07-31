import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { themeName } from '../../editor-theme';
import { NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-mod-manage',
  imports: [ReactiveFormsModule, MonacoEditorModule, InputTextModule, TextareaModule, ToggleSwitchModule],
  templateUrl: './mod-manage.html',
  styleUrl: './mod-manage.scss'
})
export class ModManage {

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
  modForm = new FormBuilder().group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    code: ['', Validators.required],
    tags: ['', Validators.required],
    isPublic: false,
  })

  onSubmit() {

  }
}
