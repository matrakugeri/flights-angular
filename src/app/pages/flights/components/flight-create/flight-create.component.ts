import { Component, OnInit } from '@angular/core';
import { SearchingFormComponent } from '../searching-form/searching-form.component';

@Component({
  selector: 'app-flight-create',
  standalone: true,
  imports: [SearchingFormComponent],
  templateUrl: './flight-create.component.html',
  styleUrl: './flight-create.component.scss',
})
export class FlightCreateComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
