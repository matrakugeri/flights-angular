import { AbstractControl } from '@angular/forms';

export function containsValidChar(control: AbstractControl) {
  //   const hasUpperCase = /[A/Z]/.test(control.value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
  //   const valid = hasUpperCase && hasSpecialChar;
  return hasSpecialChar ? null : { doesNotContain: true };
}
