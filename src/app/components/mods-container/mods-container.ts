import { Component, inject, model, OnInit, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Mod } from '../../models/mod.model';
import { ModCard } from "../mod-card/mod-card";
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ModManage } from "../mod-manage/mod-manage";
import { RouterLink } from '@angular/router';
import { ModService } from '../../services/mod-service';

@Component({
  selector: 'app-mods-container',
  imports: [TabsModule, ModCard, SelectButtonModule, FormsModule, ButtonModule, InputTextModule, DrawerModule, RouterLink],
  templateUrl: './mods-container.html',
  styleUrl: './mods-container.scss'
})
export class ModsContainer implements OnInit {

  private readonly modService = inject(ModService);

  openedCreateModDrawer = model(false);
  stateOptions: any[] = [
    { label: 'Recent', value: 0 },
    { label: 'Mine', value: 1 },
    { label: 'Public', value: 2 }
  ];
  selectedTabIndex = signal(0);
  searchString = model('');
  myModList = signal<Mod[]>([]);

  ngOnInit(): void {
    this.loadMyMods();
  }

  loadMyMods() {
    this.modService.getMyMods().then(mods => {
      this.myModList.set(mods);
    }).catch(error => {
      console.error('Error loading mods:', error);
    });
  }
}
