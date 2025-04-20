import { Routes } from '@angular/router';

export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/flights/flights.component'),
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        '../flights/components/flight-create/flight-create.component'
      ).then((m) => m.FlightCreateComponent),
  },
];
