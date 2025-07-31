import { Component, model, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Mod } from '../../models/mod.model';
import { ModCard } from "../mod-card/mod-card";
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ModManage } from "../mod-manage/mod-manage";

@Component({
  selector: 'app-mods-container',
  imports: [TabsModule, ModCard, SelectButtonModule, FormsModule, ButtonModule, InputTextModule, DrawerModule, ModManage],
  templateUrl: './mods-container.html',
  styleUrl: './mods-container.scss'
})
export class ModsContainer {

  openedCreateModDrawer = model(false);
  stateOptions: any[] = [
    { label: 'Recent', value: 0 },
    { label: 'Mine', value: 1 },
    { label: 'Public', value: 2 }
  ];
  selectedTabIndex = signal(0);
  searchString = model('');
  myModList: Mod[] = [
    {
      id: '1',
      name: 'Example Mod 1',
      description: 'This is an example mod description.',
      version: '1.0.0',
    },
    {
      id: '2',
      name: 'Example Mod 2',
      description: 'This is another example mod description.',
      version: '1.0.1',
    },
  ]

}
