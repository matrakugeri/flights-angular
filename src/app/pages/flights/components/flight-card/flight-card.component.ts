import { Component, inject, input, output, signal } from '@angular/core';
import { Flight } from '../../flight-model/flight.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightsService } from '../../services/flights.service';
import { DeleteDialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../../../../shared/enums';
import { RoleDirective } from '../../../../shared/role.directive';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [DatePipe, RouterLink, RoleDirective],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent {
  flight = input.required<Flight>();
  flightsService = inject(FlightsService);
  snackBar = inject(MatSnackBar);
  reloadData = output<number>();
  Role = Role;
  readonly dialog = inject(MatDialog);

  openDeleteDialog(): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: { name: 'flight' },
        width: '300px',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '100ms',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.onDeleteFlight();
        }
      });
  }

  onDeleteFlight() {
    this.reloadData.emit(this.flight().id);
  }
}
