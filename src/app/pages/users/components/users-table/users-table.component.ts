import {
  AfterViewInit,
  Component,
  ViewChild,
  effect,
  input,
  output,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../users-model/users.model';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  template: `<div class="mat-elevation-z8 space">
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef class="font-medium">Id</th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          {{ element.id }}
        </td>
      </ng-container>

      <ng-container matColumnDef="firstName">
        <th mat-header-cell *matHeaderCellDef class="font-medium">
          First Name
        </th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          {{ element.firstName }}
        </td>
      </ng-container>

      <ng-container matColumnDef="lastName">
        <th mat-header-cell *matHeaderCellDef class="font-medium">Last Name</th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          {{ element.lastName }}
        </td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef class="font-medium">Email</th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          {{ element.email }}
        </td>
      </ng-container>

      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef class="font-medium">Role</th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          {{ element.role }}
        </td>
      </ng-container>

      <tr
        mat-header-row
        *matHeaderRowDef="displayedColumns"
        class="font-medium"
      ></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: displayedColumns"
        class="font-medium"
      ></tr>
    </table>
  </div> `,
  styles: `
  .font-medium {
  font-size: 1.4rem !important;
}`,
})
export class UsersTableComponent {
  users = input<User[]>();
  total = input<number>();

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'role'];

  dataSource = new MatTableDataSource<User>();

  constructor() {
    effect(() => {
      const data = this.users();
      if (data) {
        this.dataSource.data = data;
        console.log(this.dataSource.data);
      }
    });
  }
}
