import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, delay, tap, throwError } from 'rxjs';
import { UsersResponse } from '../users-model/users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor() {}
  http = inject(HttpClient);

  getUsers(params: any) {
    return this.http
      .get<UsersResponse>(`${environment.apiUrl}/users`, {
        params: this.getParams(params),
      })
      .pipe(
        delay(300),
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
