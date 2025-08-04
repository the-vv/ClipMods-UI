import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from "primeng/fieldset";
import { themeName } from '../../editor-theme';
import { MessageModule } from 'primeng/message';
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
// @ts-ignore
import { constrainedEditor } from "constrained-editor-plugin";
import { DEFAULT_MOD_CODE } from '../../constants/default-code';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { Toaster } from '../../classes/toster';

@Component({
  selector: 'create-mod-form',
  templateUrl: 'create-mod-form.html',
  imports: [FieldsetModule, ButtonModule, SelectButtonModule, TextareaModule, InputTextModule, MessageModule, MonacoEditorModule, FormsModule, InputNumberModule, ReactiveFormsModule],
  styleUrls: ['./create-mod-form.scss']
})
export class CreateModForm implements OnInit {

  modForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    code: new FormControl(''),
    inputCount: new FormControl(1, [Validators.min(1)]),
    private: new FormControl(true),
  })
  stateOptions: any[] = [
    { label: 'Private', value: true },
    { label: 'Public', value: false },
  ];
  pasteEditorOptions = {
    theme: themeName,
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
  };

  ngOnInit(): void {
    this.modForm.patchValue({
      code: DEFAULT_MOD_CODE
    });
  }


  onInitEditor(editorInstance: any) {
    setTimeout(() => {
      const monaco = (window as any).monaco;
      editorInstance.addCommand(monaco.KeyCode.KeyA | monaco.KeyMod.CtrlCmd, () => {
        // Do nothing, effectively disabling select all
      }, 'editorTextFocus');
      const model = editorInstance.getModel();

      // - Configuration for the Constrained Editor : Starts Here
      const constrainedInstance = constrainedEditor(monaco);
      constrainedInstance.initializeIn(editorInstance);
      // constrainedInstance.toggleDevMode();
      const range = [19, 1, 23, 1];
      constrainedInstance.addRestrictionsTo(model, [{
        range,
        allowMultiline: true,
        label: 'utilName'
      }]);
      this.setReadonlyColors(editorInstance);
    });
  }

  setReadonlyColors(editorInstance: any) {
    const monaco = (window as any).monaco;
    editorInstance.deltaDecorations([], [{
      range: new monaco.Range(1,1, 18, 1),
      options: {
        isWholeLine: true,
        className: 'readonly-decoration',
        stickiness: 1
      }
    }, {
      range: new monaco.Range(24, 1, 26, 1),
      options: {
        isWholeLine: true,
        className: 'readonly-decoration',
        stickiness: 1
      }
    }]);
    // model.setDecorations(decorations);
  }

  onSubmit() {
    if (this.modForm.valid) {
      // Handle form submission
    } else {
      Toaster.showError('Please fill in all required fields.');
    }
  }
}
