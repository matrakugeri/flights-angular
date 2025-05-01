import { Component, inject } from '@angular/core';
import { FlightParams, FlightsStore } from '../../services/flights.store';
import { AsyncPipe, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';
import { FlightCardComponent } from '../../components/flight-card/flight-card.component';
import {
  FormObject,
  SearchingFormComponent,
} from '../../components/searching-form/searching-form.component';
import { FlightsService } from '../../services/flights.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleDirective } from '../../../../shared/role.directive';
import { Role } from '../../../../shared/enums';

@Component({
  selector: 'app-flights',
  imports: [
    AsyncPipe,
    SpinnerComponent,
    FlightCardComponent,
    SearchingFormComponent,
    MatPaginatorModule,
    NgIf,
    RouterLink,
    RoleDirective,
  ],
  standalone: true,
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
  providers: [FlightsStore],
})
export default class FlightsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(FlightsStore);
  flightService = inject(FlightsService);
  snackBar = inject(MatSnackBar);
  Role = Role;

  queryParams$ = this.route.queryParams.pipe(
    take(1),
    tap((params) => {
      console.warn(params);
      console.log(this.store.params);
      this.store.load(params);
    })
  );

  getFlights(params: FormObject) {
    this.store.load({ ...params, start: 0 });
    console.log(params);
    this.router.navigate(['/flights'], {
      queryParams: {
        ...params,
      },
    });
  }

  onPageChange(event: any) {
    console.log(event);
    console.log(event.pageIndex, event.pageSize);

    const start = event.pageIndex * event.pageSize;
    const limit = event.pageSize;
    const currentParams = this.store.params;

    this.store.load({ start, limit });

    this.router.navigate(['/flights'], {
      queryParams: {
        ...currentParams,
        start,
        limit,
      },
    });
  }

  onReset(params: Partial<FlightParams>) {
    this.store.load(params);
    this.router.navigate(['/flights'], {
      queryParams: {},
    });
  }

  onReload(id: number) {
    this.store.deleteFlight(id);
  }
}
