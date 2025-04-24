import { Component, inject, input, signal } from '@angular/core';
import { Flight } from '../../flight-model/flight.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightsService } from '../../services/flights.service';

@Component({
  selector: 'app-flight-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent {
  flight = input.required<Flight>();
  flightsService = inject(FlightsService);
}
