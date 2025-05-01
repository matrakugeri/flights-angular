import {
  HttpClient,
  HttpParams,
  HttpRequest,
  httpResource,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor() {}
  http = inject(HttpClient);

  getUsers(params: any) {
    return this.http
      .get(`${environment.apiUrl}/users`, {
        params: this.getParams(params),
      })
      .pipe(
        tap((res) => console.log(res)),
        catchError((err) => throwError(() => err))
      );
  }

  getParams(params: any) {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('_limit', params.limit);
    httpParams = httpParams.set('_start', params.start);

    if (params.firstName) {
      httpParams = httpParams.set('firstName', params.firstName);
    }

    if (params.lastName) {
      httpParams = httpParams.set('lastName', params.lastName);
    }
    console.log(httpParams);
    return httpParams;
  }
}
