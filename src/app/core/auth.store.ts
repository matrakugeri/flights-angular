import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDetails } from '../pages/auth/auth-model/auth.model';
import { map } from 'rxjs';

export interface AuthState {
  token: string | null;
  user: UserDetails | null;
}

export const initialState: AuthState = {
  token: null,
  user: null,
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  destroyRef = inject(DestroyRef);

  constructor() {
    this.state$.subscribe(console.log);
  }

  state$$ = new BehaviorSubject<AuthState>(initialState);
  state$ = this.state$$.asObservable(); // Read-Only observable
  token$ = this.state$.pipe(map((state) => state.token));
  user$ = this.state$.pipe(map((state) => state.user));
  role$ = this.state$.pipe(map((state) => state.user?.role));

  get token(): string | null {
    return this.state$$.getValue().token;
  }

  get authState(): AuthState {
    return this.state$$.getValue();
  }

  get role(): string {
    return this.state$$.getValue().user?.role!;
  }

  setState(state: AuthState): void {
    this.state$$.next({ ...state });
  }

  setToken(token: string): void {
    this.state$$.next({ ...this.authState, token });
  }

  setUser(user: UserDetails): void {
    this.state$$.next({ ...this.authState, user });
  }
}
