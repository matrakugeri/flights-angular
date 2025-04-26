import { NgIf } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';
import { AuthStore } from '../core/auth.store';

@Directive({
  selector: '[role]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class RoleDirective {
  role = input.required();
  ngIfRef = inject(NgIf);
  authStore = inject(AuthStore);

  constructor() {
    effect(() => {
      this.ngIfRef.ngIf = this.role() === this.authStore.role;
    });
  }
}
