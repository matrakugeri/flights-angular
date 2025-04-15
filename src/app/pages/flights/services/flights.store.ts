import { inject, Injectable } from '@angular/core';
import { Flight } from '../flight-model/flight.model';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { FlightsService } from './flights.service';

export interface FlightParams {
  limit: number;
  start: number;
  title?: string | null;
  flightNumber?: string | null;
  destinationFullName?: string | null;
  airline?: string | null;
}

export interface FlightsState {
  data: Flight[];
  params: FlightParams;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialState: FlightsState = {
  data: [],
  params: {
    limit: 10,
    start: 0,
    title: null,
    flightNumber: null,
    destinationFullName: null,
    airline: null,
  },
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

  get params() {
    return this.get((s) => s.params);
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
          tap((response: Flight[]) => {
            this.patchState({
              data: response,
              loading: false,
              loaded: true,
              params: newParams,
              error: null,
            });
          }),
          catchError((err) => {
            this.patchState({
              data: [],
              loading: false,
              loaded: false,
              params: initialState.params,
              error: err,
            });
            return EMPTY;
          })
        );
      })
    )
  );
}
