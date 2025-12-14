import {
  AfterViewInit,
  Component,
  ViewChild,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../users-model/users.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../flights/components/dialog/dialog.component';

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

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef class="font-medium">Actions</th>
        <td mat-cell *matCellDef="let element" class="font-medium">
          <div class="actions">
            <i (click)="onDelete(element.id)" class="material-icons"
              >delete_outline</i
            >
            <i (click)="onEdit(element)" class="material-icons">edit_note</i>
          </div>
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
  .actions{
    display:flex;
    gap:3px;
  }
  .font-medium {
  font-size: 1.4rem !important;
}`,
})
export class UsersTableComponent {
  users = input<User[]>();
  total = input<number>();
  userDeleted = output<number>();
  userEdited = output<User>();
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'role',
    'actions',
  ];

  dataSource = new MatTableDataSource<User>();

  onDelete(id: number): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: { name: 'user' },
        width: '300px',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '100ms',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.userDeleted.emit(id);
        }
      });
  }

  onEdit(user: User): void {
    this.userEdited.emit(user);
  }

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
