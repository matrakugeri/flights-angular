import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, debounceTime, delay, tap, throwError } from 'rxjs';
import { User } from '../auth-model/auth.model';
import { AuthStore } from '../../../core/auth.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  authStore = inject(AuthStore);
  router = inject(Router);

  login(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        delay(1000),
        tap({
          next: (res) => {
            this.authStore.setState({ token: res.token, user: res.user });
            localStorage.setItem('user', JSON.stringify(res));
            this.router.navigate(['/flights']);
          },
        }),
        catchError((err) => {
          this.snackBar.open(err.error.message, 'ERROR OCCURED', {
            panelClass: ['custom-snackbar'],
            duration: 2000,
          });
          return throwError(() => err);
        })
      );
  }

  register(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/auth/register`, {
        email: email,
        password: password,
      })
      .pipe(
        delay(1000),
        tap({
          next: () =>
            this.snackBar.open('You registered successfully', 'Message', {
              panelClass: ['custom-snackbar'],
              duration: 2000,
            }),
        }),
        catchError((err) => {
          console.log(err);
          this.snackBar.open(err.error.message, 'ERROR', {
            panelClass: ['custom-snackbar'],
            duration: 2000,
          });
          return throwError(() => err);
        })
      );
  }
}
