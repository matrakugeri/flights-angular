import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { nonAuthGuard } from './core/guards/non-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'flights',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [nonAuthGuard],
    loadComponent: () =>
      import('./pages/auth/containers/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'flights',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/flights/flights.routes').then((m) => m.FLIGHT_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'flights',
  },
];
