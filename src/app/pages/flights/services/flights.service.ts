import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Flight } from '../flight-model/flight.model';
import { environment } from '../../../../environments/environment';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { FlightsResponse } from './flights.store';

@Injectable({ providedIn: 'root' })
export class FlightsService {
  http = inject(HttpClient);

  constructor() {}

  createFlight(flight: Omit<Flight, 'id'>) {
    return this.http.post<Flight>(`${environment.apiUrl}/flights`, flight).pipe(
      delay(2000),
      tap((res) => console.log(res)),
      catchError((err) => throwError(() => err))
    );
  }

  getFlights(params: any): Observable<FlightsResponse> {
    console.log(params);
    return this.http
      .get<FlightsResponse>(`${environment.apiUrl}/flights`, {
        params: this.getParams(params),
      })
      .pipe(delay(100));
  }

  getParams(params: any): HttpParams {
    let httpParams = new HttpParams();

    console.log(params);
    httpParams = httpParams.set('_limit', params.limit);
    httpParams = httpParams.set('_start', params.start);

    if (params.title) {
      httpParams = httpParams.set('q', params.title);
    }

    if (params.originFullName) {
      httpParams = httpParams.set('originFullName', params.originFullName);
    }

    if (params.destinationFullName) {
      httpParams = httpParams.set(
        'destinationFullName',
        params.destinationFullName
      );
    }

    if (params.airline) {
      httpParams = httpParams.set('airline', params.airline);
    }

    if (params.flightNumber) {
      httpParams = httpParams.set('flightNumber', params.flightNumber);
    }

    console.log(httpParams);
    return httpParams;
  }
}
