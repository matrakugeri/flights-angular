import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }

  register(email: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/register`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }
}
