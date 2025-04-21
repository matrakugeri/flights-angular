import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlightsService } from '../../services/flights.service';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Flight } from '../../flight-model/flight.model';

@Component({
  selector: 'app-flight-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './flight-create.component.html',
  styleUrl: './flight-create.component.scss',
})
export class FlightCreateComponent {
  flightsService = inject(FlightsService);
  isLoading = signal(false);
  snackBar = inject(MatSnackBar);
  constructor() {}

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

    return `${year}-${day}-${month}`;
  }

  getBothFormatted(timeStr: string, dateStr: string): string {
    const formattedTime = this.formatTime(timeStr);
    const formattedDate = this.formatDate(dateStr);

    const formattedBoth =
      `${this.formatDate(dateStr)}T` + `${this.formatTime(timeStr)}`;

    return formattedBoth;
  }

  form = new FormGroup({
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
    arrivalTime: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    arrivalDate: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
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

    this.flightsService.createFlight(newFlight).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        console.log(res);
        this.snackBar.open('Flight was created succesfully', 'Message', {
          duration: 2000,
        });
      },
      error: (err) =>
        this.snackBar.open(err.error.message, 'Message', {
          duration: 2000,
        }),
    });
  }

  onDiscard() {
    this.form.reset();
  }
}
