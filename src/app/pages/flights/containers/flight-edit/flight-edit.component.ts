import { Component, effect, input, signal } from '@angular/core';
import { inject } from '@angular/core';
import { Flight } from '../../flight-model/flight.model';
import { FlightsService } from '../../services/flights.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';
import { FlightFormComponent } from '../../components/flights-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-edit',
  imports: [FlightFormComponent, SpinnerComponent],
  template: `@if(isLoading()){
    <loading-spinner />
    }
    <app-flights-form
      [flightValues]="flightResponse()"
      (saveChanges)="onEdit($event)"
      [isEditMode]="true"
    ></app-flights-form> `,
  styles: ``,
})
export class FlightEditComponent {
  id = input.required<number>();
  flightsService = inject(FlightsService);
  snackBar = inject(MatSnackBar);
  isLoading = signal<boolean>(false);
  router = inject(Router);

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
          'Flight with id: ' + ' ' + this.id() + ' was edited succesfully',
          'Message',
          {
            duration: 2000,
          }
        );
        this.router.navigate(['/flights']);
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
