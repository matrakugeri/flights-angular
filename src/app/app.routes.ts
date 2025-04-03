import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'flights',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/auth/auth.routes'),
      },
    ],
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
