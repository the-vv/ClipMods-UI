import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./pages/main-layout/main-layout').then(m => m.MainLayout),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
