import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FlightsService } from '../../services/flights.service';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Flight } from '../../flight-model/flight.model';
import { FlightFormComponent } from '../../../../shared/flights-form.component';

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
    FlightFormComponent,
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

  onCreate(newFlight: Omit<Flight, 'id'>) {
    this.isLoading.set(true);
    this.flightsService.createFlight(newFlight).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.snackBar.open('Flight was created succesfully', 'Message', {
          duration: 2000,
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.error.message, 'Message', {
          duration: 2000,
        });
      },
    });
  }
}
