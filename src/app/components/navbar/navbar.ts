import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { PocketbaseService } from '../../services/pocketbase-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, AvatarModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  private readonly pocketbaseService = inject(PocketbaseService);

  get isLoggedIn(): boolean {
    return this.pocketbaseService.isLoggedIn();
  }

}
