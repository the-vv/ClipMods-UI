import { Component, inject, input } from '@angular/core';
import { Mod } from '../../models/mod.model';
import { Button } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { ModService } from '../../services/mod-service';

@Component({
  selector: 'app-mod-card',
  imports: [Button, TooltipModule, DatePipe],
  templateUrl: './mod-card.html',
  styleUrl: './mod-card.scss'
})
export class ModCard {

  protected readonly modService = inject(ModService);

  modData = input.required<Mod>();

  runMod() {
    this.modService.triggerModWithId$.next(this.modData().id!);
  }

}
