import { Component } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-paste-options',
  imports: [ToggleSwitchModule, TooltipModule],
  templateUrl: './paste-options.html',
  styleUrl: './paste-options.scss'
})
export class PasteOptions {

}
