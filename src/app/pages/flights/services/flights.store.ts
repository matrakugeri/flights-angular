import { inject, Injectable } from '@angular/core';
import { Flight } from '../flight-model/flight.model';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { FlightsService } from './flights.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface FlightsResponse {
  total: number;
  data: Flight[];
}

export interface FlightParams {
  limit: number;
  start: number;
  title?: string | null;
  flightNumber?: string | null;
  originFullName?: string | null;
  destinationFullName?: string | null;
  airline?: string | null;
}

export interface FlightsState {
  data: Flight[];
  params: FlightParams;
  loading: boolean;
  loaded: boolean;
  total: number;
  error: string | null;
}

export const initialState: FlightsState = {
  data: [],
  params: {
    limit: 10,
    start: 0,
    title: null,
    flightNumber: null,
    originFullName: null,
    destinationFullName: null,
    airline: null,
  },
  total: 0,
  loading: false,
  loaded: false,
  error: null,
};

@Injectable()
export class FlightsStore extends ComponentStore<FlightsState> {
  constructor() {
    super(initialState);
  }
  flightsService = inject(FlightsService);
  snackBar = inject(MatSnackBar);

  get params() {
    return this.get((s) => s.params);
  }

  get data() {
    return this.get((s) => s.data);
  }

  load = this.effect((params: Observable<Partial<FlightParams>>) =>
    params.pipe(
      tap(() => {
        this.patchState({ loading: true });
      }),
      switchMap((params) => {
        console.log(params, 'PARAMS!');

        const newParams = { ...this.params, ...params };
        console.log(newParams);

        // NEED TOTALS --- for pagination
        return this.flightsService.getFlights(newParams).pipe(
          tap((response: FlightsResponse) => {
            console.log(response);
            this.patchState({
              data: response.data,
              loading: false,
              loaded: true,
              params: newParams,
              total: response.total,
              error: null,
            });
          }),
          catchError((err) => {
            this.patchState({
              data: [],
              loading: false,
              loaded: false,
              params: initialState.params,
              total: 0,
              error: err,
            });
            return EMPTY;
          })
        );
      })
    )
  );

  reloadFlight = this.effect((id: Observable<number>) => {
    return id.pipe(
      tap(() => {
        this.patchState({ loading: true });
      }),
      switchMap((id) => {
        console.log(id);
        return this.flightsService.deleteFlight(id).pipe(
          tap(() => {
            this.patchState({
              data: this.data.filter((flight) => flight.id != id),
              loaded: true,
              loading: false,
              error: null,
            });
            this.snackBar.open('Flight was sucessfully deleted', 'Message', {
              duration: 2000,
            });
          }),
          catchError((err) => {
            this.patchState({
              data: [],
              loading: false,
              loaded: false,
              params: initialState.params,
              total: 0,
              error: err,
            });
            this.snackBar.open(
              err.error?.message || 'Failed to delete flight',
              'ERROR',
              {
                duration: 2000,
              }
            );
            return EMPTY;
          })
        );
      })
    );
  });
}
