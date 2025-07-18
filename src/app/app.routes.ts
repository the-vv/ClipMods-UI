import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  }
];
