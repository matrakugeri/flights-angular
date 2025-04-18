import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  form = new FormGroup({
    from: new FormControl('', {
      validators: [],
    }),
    to: new FormControl('', {
      validators: [],
    }),
    airline: new FormControl('', {
      validators: [],
    }),
    title: new FormControl('', {
      validators: [],
    }),
    flightNumber: new FormControl('', {
      validators: [],
    }),
  });

  onSubmit() {
    this.formValues.emit({
      destinationFullName: this.form.controls.to.value,
      originFullName: this.form.controls.from.value,
      airline: this.form.controls.airline.value,
      title: this.form.controls.title.value,
      flightNumber: this.form.controls.flightNumber.value,
    });
    this.form.reset();
  }
}
