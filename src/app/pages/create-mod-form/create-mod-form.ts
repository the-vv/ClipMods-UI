import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ModService } from '../../services/mod-service';
import { Router } from '@angular/router';
import { ModEngine } from '../../services/mod-engine';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'create-mod-form',
  templateUrl: 'create-mod-form.html',
  imports: [FieldsetModule, ButtonModule, DrawerModule, SelectButtonModule, TextareaModule, InputTextModule, MessageModule, MonacoEditorModule, FormsModule, InputNumberModule, ReactiveFormsModule],
  styleUrls: ['./create-mod-form.scss']
})
export class CreateModForm implements OnInit {

  private readonly modService = inject(ModService);
  private readonly router= inject(Router);
  private readonly modEngineService = inject(ModEngine);

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
  plainTextOptions = {
    ...this.pasteEditorOptions,
    language: 'plaintext',
    scrollbar: {
      alwaysConsumeMouseWheel: false
    }
  }
  plainTextOptionsWithReadonly = {
    ...this.plainTextOptions,
    readOnly: true,
  }
  modTestSidebarConfig = signal({
    visible: false,
    inputs: 0,
    code: '',
    args: [] as string[],
    output: '',
    runSuccess: false
  })
  getIterableOf(count: number) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.modForm.patchValue({
      code: DEFAULT_MOD_CODE
    });
  }


  onInitEditor(editorInstance: any) {
    setTimeout(() => {
      const monaco = (window as any).monaco;
      // editorInstance.addCommand(monaco.KeyCode.KeyA | monaco.KeyMod.CtrlCmd, () => {
      //   // Do nothing, effectively disabling select all
      // }, 'editorTextFocus');
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
      }, {
        range: [26, 1, 28, 1],
        allowMultiline: true,
        label: 'executeFunction'
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
      range: new monaco.Range(24, 1, 25, 1),
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
      this.modTestSidebarConfig.set({
        code: this.modForm.value.code || DEFAULT_MOD_CODE,
        inputs: this.modForm.value.inputCount || 1,
        visible: true,
        args: Array.from({ length: this.modForm.value.inputCount || 1 }, (_, i) => ``),
        output: '',
        runSuccess: false
      })
      // this.modEngineService.runJsCode(
      //   this.modForm.value.code!,
      //   ["hello", "world"] // Example inputs, replace with actual inputs as needed
      // ).then(() => {
      //   Toaster.showSuccess('Mod executed successfully!');
      // }).catch(error => {
      //   console.log('Error executing mod:', error);
      //   Toaster.showError('Failed to execute mod. Please check the console for details.');
      // });
      // Handle form submission
      // const mod: Mod = {
      //   id: '',
      //   name: this.modForm.value.name || '',
      //   description: this.modForm.value.description || '',
      //   code: this.modForm.value.code || DEFAULT_MOD_CODE,
      //   isPublic: !this.modForm.value.private,
      //   inputCount: this.modForm.value.inputCount || 1,
      //   version: 1
      // }
      // this.modService.createMod(mod).then(() => {
      //   Toaster.showSuccess('Mod created successfully!');
      //   this.router.navigate(['/']);
      // }).catch(error => {
      //   console.error('Error creating mod:', error);
      //   Toaster.showError('Failed to create mod. Please try again.');
      // });
    } else {
      Toaster.showError('Please fill in all required fields.');
    }
  }

  onSave() {}

  runMod() {
    if (this.modTestSidebarConfig().args.every(arg => !arg.trim())) {
      Toaster.showError('Please provide at least one input argument.');
      return;
    }
    this.modEngineService.runJsCode(
      this.modForm.value.code!,
      this.modTestSidebarConfig().args || [] // Use the args from the sidebar config
    ).then((res: string) => {
      Toaster.showSuccess('Mod executed successfully!');
      this.modTestSidebarConfig.set({
        ...this.modTestSidebarConfig(),
        output: res,
        runSuccess: true
      });
    }).catch(error => {
      console.log('Error executing mod:', error);
      Toaster.showError('Failed to execute mod. Please check the console for details.');
    });
  }

  setReadonly(editorInstance: any) {
    const monaco = (window as any).monaco;
    editorInstance.updateOptions({ readOnly: true });
  }
}
