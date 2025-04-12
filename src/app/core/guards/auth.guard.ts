import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../auth.store';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.token$.pipe(
    map((token) => {
      console.log(token);
      if (token) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
