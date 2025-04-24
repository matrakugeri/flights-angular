import { Component, effect, input, signal } from '@angular/core';
import { inject } from '@angular/core';
import { Flight } from '../../flight-model/flight.model';
import { FlightsService } from '../../services/flights.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlightFormComponent } from '../../../../shared/flights-form.component';
import { take } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';

@Component({
  selector: 'app-flight-edit',
  imports: [FlightFormComponent, SpinnerComponent],
  templateUrl: './flight-edit.component.html',
  styleUrl: './flight-edit.component.scss',
})
export class FlightEditComponent {
  id = input.required<number>();
  flightsService = inject(FlightsService);
  snackBar = inject(MatSnackBar);
  isLoading = signal<boolean>(false);

  flightResponse = signal<Flight | null>(null);

  ngOnInit() {}

  constructor() {
    effect(() => {
      if (this.id()) {
        this.flightsService
          .getFlight(this.id())
          .pipe(take(1))
          .subscribe({
            next: (res) => this.flightResponse.set(res),
            error: (err) =>
              this.snackBar.open(err.error.message, 'ERROR', {
                duration: 2000,
              }),
          });
      }
    });
  }

  onEdit(flight: any) {
    this.isLoading.set(true);
    this.flightsService.editFlight(flight, this.id()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.snackBar.open(
          `Flight with id: ${this.id()} was edited succesfully`,
          'Message',
          {
            duration: 2000,
          }
        );
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
