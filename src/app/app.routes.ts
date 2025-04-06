import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
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
