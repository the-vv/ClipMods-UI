import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { PocketbaseService } from '../../services/pocketbase-service';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../services/common-service';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, AvatarModule, RouterLink, MenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  protected readonly pocketbaseService = inject(PocketbaseService);
  private readonly commonService = inject(CommonService);
  private readonly router = inject(Router);
  menuItems = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.pocketbaseService.logout();
        this.router.navigate(['/auth']);
      }
    },
  ];

  currentVersion = signal<string>('');

  get isLoggedIn(): boolean {
    return this.pocketbaseService.isLoggedIn();
  }

  ngOnInit(): void {
    this.commonService.getCurrentVersionAsync().subscribe(response => {
      this.currentVersion.set(response.version);
    });
  }
}
