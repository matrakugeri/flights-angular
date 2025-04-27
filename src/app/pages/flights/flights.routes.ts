import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

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
    canMatch: [roleGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./containers/flight-edit/flight-edit.component').then(
        (m) => m.FlightEditComponent
      ),
    canMatch: [roleGuard],
  },
];
