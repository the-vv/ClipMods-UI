import { Component, inject, input, model, signal } from '@angular/core';
import { Mod } from '../../models/mod.model';
import { Button } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe, NgClass } from '@angular/common';
import { ModService } from '../../services/mod-service';
import { DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { Toaster } from '../../classes/toster';
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { themeName } from '../../editor-theme';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common-service';

@Component({
  selector: 'app-mod-card',
  imports: [Button, TooltipModule, DatePipe, FormsModule, NgClass, DrawerModule, FieldsetModule, MonacoEditorModule],
  templateUrl: './mod-card.html',
  styleUrl: './mod-card.scss'
})
export class ModCard {

  protected readonly modService = inject(ModService);
  private readonly commonService = inject(CommonService);

  codeViewerSidebarConfig = signal({
    visible: false,
    code: ''
  });
  pasteEditorOptions = {
    theme: themeName,
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
    readonly: true
  };

  modData = input.required<Mod>();

  runMod() {
    this.modService.triggerModWithId$.next(this.modData().id!);
  }

  isMatchingInputCount(): boolean {
    return this.modService.currentInputLength() === this.modData().inputCount;
  }

  viewCode(id: string) {
    this.commonService.setLoading(true);
    this.modService.getModById(id).then(mod => {
      this.codeViewerSidebarConfig.set({ visible: true, code: mod.code });
    }).catch(error => {
      Toaster.showError('Error fetching mod');
    }).finally(() => {
      this.commonService.setLoading(false);
    });
  }

  onInitEditor(editor: any) {
    editor.updateOptions({ readOnly: true })
  }

}
