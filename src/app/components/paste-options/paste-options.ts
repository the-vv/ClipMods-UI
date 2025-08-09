import { Component, input, output } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ModRunOptions } from '../../models/mod-run-options.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paste-options',
  imports: [ToggleSwitchModule, TooltipModule, InputNumberModule, FormsModule],
  templateUrl: './paste-options.html',
  styleUrl: './paste-options.scss'
})
export class PasteOptions {

  modOptions = input.required<ModRunOptions>();
  optionChanged = output<{ key: keyof ModRunOptions, value: any }>();

  onOptionChange(key: keyof ModRunOptions) {
    this.optionChanged.emit({ key, value: this.modOptions()[key] });
  }
}
