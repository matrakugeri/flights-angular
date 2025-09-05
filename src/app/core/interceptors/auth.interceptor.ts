import { HttpInterceptorFn } from '@angular/common/http';
import { AuthStore } from '../auth.store';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  return next(authRequest);
};
