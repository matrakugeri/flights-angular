import { Component } from '@angular/core';
import { UsersFormComponent } from './components/users-form/users-form.component';
import { UsersTableComponent } from './components/users-table/users-table.component';

@Component({
  selector: 'app-users',
  imports: [UsersFormComponent, UsersTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  getUsers(params: any) {}
}
