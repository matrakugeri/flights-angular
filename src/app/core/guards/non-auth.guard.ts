import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthStore } from '../auth.store';

export const nonAuthGuard: CanMatchFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.token$.pipe(
    map((token) => {
      if (!token) {
        console.log(token);
        return true;
      }
      return router.createUrlTree(['/flights']);
    })
  );
};
