import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs';

export function containsValidChar(control: AbstractControl) {
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
  return hasSpecialChar ? null : { doesNotContain: true };
}

export function compareDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const departureDate = control.get('departureDate')?.value;
    const departureTime = control.get('departureTime')?.value;
    const arrivalDate = control.get('arrivalDate')?.value;
    const arrivalTime = control.get('arrivalTime')?.value;

    if (!departureDate || !departureTime || !arrivalDate || !arrivalTime) {
      return null;
    }

    const departureDateObj = new Date(departureDate);
    console.log(departureDateObj);
    const arrivalDateObj = new Date(arrivalDate);
    const departureTimeObj = new Date(departureTime);
    const arrivalTimeObj = new Date(arrivalTime);

    const firstDate = departureDateObj.getTime();
    const secondDate = arrivalDateObj.getTime();

    const firstTime = departureTimeObj.getTime();
    const secondTime = arrivalTimeObj.getTime();
    console.log(firstDate, secondDate);
    console.log(firstDate > secondDate);
    console.log(firstTime, secondTime);
    console.log(firstTime >= secondTime);

    if (firstDate > secondDate) {
      return { dateValidator: true };
    } else if (firstDate == secondDate && firstTime >= secondTime) {
      return { dateValidator: true };
    }
    return null;
  };
}
