import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlightParams } from '../../services/flights.store';

export interface FormObject {
  destinationFullName: string | null;
  originFullName: string | null;
  airline: string | null;
  title: string | null;
  flightNumber: string | null;
}

@Component({
  selector: 'app-searching-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './searching-form.component.html',
  styleUrl: './searching-form.component.scss',
})
export class SearchingFormComponent {
  formValues = output<FormObject>();
  params = input<FlightParams>();
  resetForm = output<Partial<FlightParams>>();

  form = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
    airline: new FormControl(''),
    title: new FormControl(''),
    flightNumber: new FormControl(''),
  });

  onSubmit() {
    this.formValues.emit({
      destinationFullName: this.form.controls.to.value || null,
      originFullName: this.form.controls.from.value || null,
      airline: this.form.controls.airline.value || null,
      title: this.form.controls.title.value || null,
      flightNumber: this.form.controls.flightNumber.value || null,
    });
  }

  get isNotEmptyForm(): boolean {
    const values = this.form.value;
    return Object.values(values).some((value) => !!value?.toString().trim());
  }

  onReset() {
    this.form.reset();
    console.log(this.form.value);
    const params = {
      start: 0,
      title: null,
      flightNumber: null,
      originFullName: null,
      destinationFullName: null,
      airline: null,
    };
    this.resetForm.emit(params);
  }

  constructor() {
    effect(() => {
      this.form.patchValue({
        from: this.params()?.originFullName,
        to: this.params()?.destinationFullName,
        title: this.params()?.title,
        airline: this.params()?.airline,
        flightNumber: this.params()?.flightNumber,
      });
    });
  }
}
