import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PocketbaseService } from '../services/pocketbase-service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PocketbaseService).isLoggedIn() || inject(Router).parseUrl('/auth')
};
