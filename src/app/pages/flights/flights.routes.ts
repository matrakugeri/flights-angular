import { Routes, withComponentInputBinding } from '@angular/router';

export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/flights/flights.component'),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./containers/flight-create/flight-create.component').then(
        (m) => m.FlightCreateComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./containers/flight-edit/flight-edit.component').then(
        (m) => m.FlightEditComponent
      ),
  },
];
