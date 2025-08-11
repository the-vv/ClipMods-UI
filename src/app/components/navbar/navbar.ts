import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { PocketbaseService } from '../../services/pocketbase-service';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common-service';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, AvatarModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  private readonly pocketbaseService = inject(PocketbaseService);
  private readonly commonService = inject(CommonService);

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
