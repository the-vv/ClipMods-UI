import { Component, DestroyRef, inject, Injector, model, OnInit, resource, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Mod } from '../../models/mod.model';
import { ModCard } from "../mod-card/mod-card";
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { Router, RouterLink } from '@angular/router';
import { ModService } from '../../services/mod-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PocketbaseService } from '../../services/pocketbase-service';
import { Recent } from '../../models/recents.mode';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-mods-container',
  imports: [TabsModule, ModCard, ConfirmDialogModule, ReactiveFormsModule, SelectButtonModule, FormsModule, ButtonModule, InputTextModule, DrawerModule, PaginatorModule],
  templateUrl: './mods-container.html',
  styleUrl: './mods-container.scss'
})
export class ModsContainer implements OnInit {

  protected readonly modService = inject(ModService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly pocketbaseService = inject(PocketbaseService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly publicListParams = {
    page: signal(1),
    perPage: signal(10),
    searchStr: signal(''),
    totalItems: signal(0)
  }

  publicResource = resource({
    params: () => ({
      page: this.publicListParams.page(),
      perPage: this.publicListParams.perPage(),
      searchStr: this.publicListParams.searchStr()
    }),
    loader: ({ params }) => {
      return this.modService.getPublicMods(params.page, params.perPage, params.searchStr);
    }
  })

  myModResource = resource({
    params: () => ({
      searchStr: this.myModSearchString()
    }),
    loader: ({ params }) => {
      return this.modService.getMyMods(params.searchStr);
    }
  })

  openedCreateModDrawer = model(false);
  stateOptions: any[] = [
    { label: 'Recent', value: 0 },
    { label: 'Mine', value: 1 },
    { label: 'Public', value: 2 }
  ];
  selectedTabIndex = signal(0);
  recentMods = signal<Mod[]>([]);
  myModSearchString = model('');

  publicModSearchCtrl = new FormControl('');
  myModSearchCtrl = new FormControl('');

  ngOnInit(): void {
    // this.loadMyMods();
    this.getRecentMods();
    this.myModSearchCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300)
    ).subscribe({
      next: (val) => {
        this.myModSearchString.set(val || '');
      }
    })
    this.publicModSearchCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300)
    ).subscribe({
      next: (val) => {
        this.publicListParams.searchStr.set(val || '');
      }
    })
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

  loadNextPublicPage(event: PaginatorState) {
    this.publicListParams.page.set(event.page!);
    this.publicListParams.perPage.set(event.rows!);
  }
}
