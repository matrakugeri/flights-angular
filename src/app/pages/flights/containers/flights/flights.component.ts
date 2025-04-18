import { Component, inject, OnInit } from '@angular/core';
import { FlightsStore } from '../../services/flights.store';
import { AsyncPipe, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';
import { FlightCardComponent } from '../../components/flight-card/flight-card.component';
import {
  FormObject,
  SearchingFormComponent,
} from '../../components/searching-form/searching-form.component';
import { FlightsService } from '../../services/flights.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-flights',
  imports: [
    AsyncPipe,
    SpinnerComponent,
    FlightCardComponent,
    SearchingFormComponent,
    MatPaginatorModule,
    NgIf,
  ],
  standalone: true,
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
  providers: [FlightsStore],
})
export default class FlightsComponent implements OnInit {
  store = inject(FlightsStore);
  flightService = inject(FlightsService);

  ngOnInit(): void {
    this.store.load({ limit: 10 });
  }

  getFlights(params: FormObject) {
    this.store.load({ ...params });
  }

  onPageChange(event: any) {
    console.log(event);
    console.log(event.pageIndex, event.pageSize);

    const start = event.pageIndex * event.pageSize;
    const limit = event.pageSize;

    this.store.load({ start, limit });
  }
}
