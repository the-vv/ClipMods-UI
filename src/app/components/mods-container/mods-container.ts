import { Component, inject, model, OnInit, resource, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Mod } from '../../models/mod.model';
import { ModCard } from "../mod-card/mod-card";
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ModManage } from "../mod-manage/mod-manage";
import { Router, RouterLink } from '@angular/router';
import { ModService } from '../../services/mod-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PocketbaseService } from '../../services/pocketbase-service';
import { Recent } from '../../models/recents.mode';

@Component({
  selector: 'app-mods-container',
  imports: [TabsModule, ModCard, ConfirmDialogModule, SelectButtonModule, FormsModule, ButtonModule, InputTextModule, DrawerModule],
  templateUrl: './mods-container.html',
  styleUrl: './mods-container.scss'
})
export class ModsContainer implements OnInit {

  private readonly modService = inject(ModService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly pocketbaseService = inject(PocketbaseService);

  protected readonly publicListParams = {
    page: signal(1),
    perPage: signal(10),
    searchStr: signal('')
  }

  publicResource = resource({
    params: () => ({
      page: this.publicListParams.page(),
      perPage: this.publicListParams.perPage(),
      searchStr: this.publicListParams.searchStr()
    }),
    loader: (param) => {
      return this.modService.getPublicMods(param.params.page, param.params.perPage, param.params.searchStr);
    }
  })

  myModResource = resource({
    loader: () => {
      return this.modService.getMyMods();
    }
  })

  openedCreateModDrawer = model(false);
  stateOptions: any[] = [
    { label: 'Recent', value: 0 },
    { label: 'Mine', value: 1 },
    { label: 'Public', value: 2 }
  ];
  selectedTabIndex = signal(0);
  searchString = model('');
  recentMods = signal<Mod[]>([]);

  ngOnInit(): void {
    // this.loadMyMods();
    this.getRecentMods();
  }

  // loadMyMods() {
  //   this.modService.getMyMods().then(mods => {
  //     this.myModList.set(mods);
  //   }).catch(error => {
  //     console.error('Error loading mods:', error);
  //   });
  // }

  onCreate() {
    if (this.pocketbaseService.isLoggedIn()) {
      this.router.navigate(['/create-mod']);
    } else {
      this.confirmationService.confirm({
        message: 'Login is required to create a mod. Do you want to login now?',
        header: 'Login Required',
        rejectButtonProps: {
          label: 'No',
          severity: 'secondary',
          outlined: true,
        },
        accept: () => {
          this.router.navigate(['/auth']);
        }
      });
    }
  }

  getRecentMods() {
    this.modService.getRecents().then(mods => {
      this.recentMods.set(mods);
    }).catch(error => {
      console.error('Error loading recent mods:', error);
    });
  }
}
