import { Routes } from '@angular/router';

const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./containers/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];

export default AUTH_ROUTES;
