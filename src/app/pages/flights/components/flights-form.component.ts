import { Component, effect, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { compareDateValidator } from '../../../utils/validators';
import { Flight } from '../flight-model/flight.model';

@Component({
  selector: 'app-flights-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: ` <section class="center">
    <form class="create-flight-form" [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2 class="primary-form-heading">
        {{ isEditMode() ? 'ADD' : 'CREATE' }} A NEW FLIGHT
      </h2>
      <div class="create-flight-container">
        <mat-form-field appearance="outline">
          <mat-label>Origin</mat-label>
          <input matInput formControlName="origin" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Origin FullName</mat-label>
          <input matInput formControlName="originFullName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Destination</mat-label>
          <input matInput formControlName="destination" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Destination FullName</mat-label>
          <input matInput formControlName="destinationFullName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Airline</mat-label>
          <input matInput formControlName="airline" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>FlightNumber</mat-label>
          <input matInput formControlName="flightNumber" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Scheduled">Scheduled</mat-option>
            <mat-option value="Delayed">Delayed</mat-option>
            <mat-option value="Cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <h2 class="datetime-heading">SELECT DATE AND TIME</h2>
      <div class="datetime-grid-container">
        <div class="datetime-inner-container">
          <h3 class="inner-container-heading">Departure Time</h3>
          <mat-form-field appearance="outline">
            <mat-label>Pick Departure Time</mat-label>
            <input
              matInput
              [matTimepicker]="picker1"
              formControlName="departureTime"
            />
            <mat-timepicker-toggle matIconSuffix [for]="picker1" />
            <mat-timepicker #picker1 />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Departure date</mat-label>
            <input
              matInput
              [matDatepicker]="datepicker"
              formControlName="departureDate"
            />
            <mat-datepicker #datepicker />
            <mat-datepicker-toggle [for]="datepicker" matSuffix />
          </mat-form-field>
        </div>
        <div class="datetime-inner-container">
          <h3 class="inner-container-heading">Arrival Time</h3>
          <mat-form-field appearance="outline">
            <mat-label>Pick Arrival Time</mat-label>
            <input
              matInput
              [matTimepicker]="picker"
              formControlName="arrivalTime"
            />
            <mat-timepicker-toggle matIconSuffix [for]="picker" />
            <mat-timepicker #picker />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Arrival date</mat-label>
            <input
              matInput
              [matDatepicker]="datepicker1"
              formControlName="arrivalDate"
            />
            <mat-datepicker #datepicker1 />
            <mat-datepicker-toggle [for]="datepicker1" matSuffix />
          </mat-form-field>
        </div>
      </div>

      @if(form.hasError('dateValidator')){
      <p class="form-error">Please select a valid date.</p>
      }

      <div class="flex-container">
        <button type="submit" class="btn2 btn-edit" [disabled]="form.invalid">
          {{ isEditMode() ? 'SAVE' : 'CREATE' }}
        </button>
        <button
          class="btn2 secondary-btn"
          type="button"
          (click)="onDiscard()"
          [disabled]="!isNotEmptyForm"
        >
          Discard
        </button>
      </div>

      <p class="reminder">Reminder *</p>
      <p class="control-form">
        {{
          isEditMode()
            ? 'Editing flight with id:' + ' ' + flightValues()?.id
            : 'Please fill all the fields in order to create a new flight.'
        }}
      </p>
    </form>
  </section>`,
  styles: `
  
 @use 'variables' as *;
 @use 'sass:color';

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .primary-form-heading {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 3rem;
    margin-top: 2.2rem;
    font-weight: 500;
    color: #6e4343;
  }
  
  .create-flight-form {
    padding: 2.5rem;
    border-radius: 11px;
    box-shadow: 2px 2px 2rem rgba(168, 115, 115, 0.3);
    width: 800px;
    margin-bottom: 3.2rem;
  }
  
  .create-flight-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.2rem;
    width: 550px;
    justify-self: center;
  }
  
  .datetime-grid-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    margin-top: 3.2rem;
    justify-items: center;
    border: 1px solid #aaa;
    border-radius: 11px;
    padding: 3rem;
  }
  
  .datetime-inner-container {
    width: 250px;
  }
  
  .datetime-heading {
    font-size: 2rem;
    text-align: center;
    margin-top: 2rem;
    font-weight: 500;
    color: #6e4343;
  }
  
  .inner-container-heading {
    margin-bottom: 2rem;
    font-size: 1.7rem;
    background-image: linear-gradient(
      to right,
      $light-blue-color,
      $dark-blue-color
    );
    color: transparent;
    background-clip: text;
    text-align: center;
  }
  
  .flex-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 2.5rem 1rem 1.3rem 0;
    gap: 1rem;
  }
  .control-form {
  font-size: 1.5rem;
  margin: 0 1rem 2rem 0;
  color: color.adjust(rgb(52, 123, 189),$lightness:10%);
}

.reminder {
  font-size: 1.3rem;
  color:color.adjust(rgb(11, 51, 85),$lightness:10%);
  margin-top: 2rem;

}

  .form-error {
    font-size: 1.7rem;
    color:color.adjust(red,$lightness:10%);
    margin-top: 2rem;
  }
  `,
})
export class FlightFormComponent {
  flightValues = input<Flight | null>(null);
  saveChanges = output<any>();
  isEditMode = input<boolean>();

  formatTime(timeStr: string): string {
    const time = new Date(timeStr);
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(time);
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getBothFormatted(timeStr: string, dateStr: string): string {
    const formattedTime = this.formatTime(timeStr);
    const formattedDate = this.formatDate(dateStr);

    const formattedBoth =
      `${this.formatDate(dateStr)}T` + `${this.formatTime(timeStr)}`;

    return formattedBoth;
  }

  form = new FormGroup(
    {
      origin: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      originFullName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      destination: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      destinationFullName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      title: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      airline: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      flightNumber: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      status: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      departureTime: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      departureDate: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      arrivalTime: new FormControl('02:00', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      arrivalDate: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: compareDateValidator() }
  );

  constructor() {
    effect(() => {
      if (this.isEditMode()) {
        console.log(this.flightValues());
        if (this.isEditMode()) {
          this.form.patchValue({
            origin: this.flightValues()?.origin,
            originFullName: this.flightValues()?.originFullName,
            destination: this.flightValues()?.destination,
            destinationFullName: this.flightValues()?.destinationFullName,
            title: this.flightValues()?.title,
            airline: this.flightValues()?.airline,
            status: this.flightValues()?.status,
            departureDate: this.flightValues()?.departureTime.split('T')[0],
            departureTime: this.flightValues()?.departureTime + ':00.000',
            arrivalDate: this.flightValues()?.arrivalTime.split('T')[0],
            arrivalTime: this.flightValues()?.arrivalTime + ':00.000',
            flightNumber: this.flightValues()?.flightNumber,
          });
          console.log(this.form.value);
        }
      }
    });
  }

  get isNotEmptyForm(): boolean {
    const values = this.form.value;
    return Object.values(values).some((value) => !!value?.toString().trim());
  }

  onSubmit() {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    const arrivalTime = this.getBothFormatted(
      formValue.arrivalTime!,
      formValue.arrivalDate!
    );
    const departureTime = this.getBothFormatted(
      formValue.departureTime!,
      formValue.departureDate!
    );
    const newFlight = {
      ...this.form.getRawValue(),
      departureTime: departureTime,
      arrivalTime: arrivalTime,
    };
    this.saveChanges.emit(newFlight);
    if (!this.isEditMode()) {
      this.form.reset();
    }
  }

  onDiscard() {
    this.form.reset();
  }
}
