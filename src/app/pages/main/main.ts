import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { PasteOptions } from "../../components/paste-options/paste-options";

@Component({
  selector: 'app-main',
  imports: [FieldsetModule, PasteOptions],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

}
