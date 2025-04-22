import { Component, input } from '@angular/core';
import { FlightCreateComponent } from '../flight-create/flight-create.component';

@Component({
  selector: 'app-flight-edit',
  imports: [FlightCreateComponent],
  templateUrl: './flight-edit.component.html',
  styleUrl: './flight-edit.component.scss',
})
export class FlightEditComponent {
  id = input<number>();
}
