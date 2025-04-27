import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../auth.store';
import { map } from 'rxjs';

export const roleGuard: CanMatchFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.role$.pipe(
    map((role) => {
      if (role === 'admin') {
        return true;
      }
      return router.createUrlTree(['/flights']);
    })
  );
};
