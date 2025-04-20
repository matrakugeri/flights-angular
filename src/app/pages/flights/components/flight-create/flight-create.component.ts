import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-flight-create',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './flight-create.component.html',
  styleUrl: './flight-create.component.scss',
})
export class FlightCreateComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
