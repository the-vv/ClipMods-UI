import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {

  private readonly pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(environment.pocketbaseUrl);
  }

  getPocketBaseInstance(): PocketBase {
    return this.pb;
  }

  logout(): void {
    return this.pb.authStore.clear();
  }

  isLoggedIn(): boolean {
    return this.pb.authStore.isValid;
  }

  getCurrentUser() {
    return this.pb.authStore.record;
  }

  getUserId(): string | null {
    return this.pb.authStore.record?.id || null;
  }

  login(email: string, password: string) {
    return this.pb.collection('users').authWithPassword(email, password);
  }
}
