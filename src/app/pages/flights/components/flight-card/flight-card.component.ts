import { Component, input } from '@angular/core';
import { Flight } from '../../flight-model/flight.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-card',
  imports: [DatePipe],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent {
  flight = input.required<Flight>();
}
