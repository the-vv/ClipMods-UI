import { Component, input } from '@angular/core';
import { Mod } from '../../models/mod.model';
import { Button } from "primeng/button";

@Component({
  selector: 'app-mod-card',
  imports: [Button],
  templateUrl: './mod-card.html',
  styleUrl: './mod-card.scss'
})
export class ModCard {

  modData = input.required<Mod>();

}
