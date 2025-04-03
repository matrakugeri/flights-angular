import { Route } from '@angular/router';

const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./containers/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];

export default AUTH_ROUTES;
