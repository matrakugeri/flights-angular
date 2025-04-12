import { Routes } from '@angular/router';

export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/flights/flights.component'),
  },
  // {
  //   path:':id',
  //   loadComponent:()=>import()
  // }
];
