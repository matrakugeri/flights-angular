import { AbstractControl } from '@angular/forms';

export function containsValidChar(control: AbstractControl) {
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
  return hasSpecialChar ? null : { doesNotContain: true };
}
