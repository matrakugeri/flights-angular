import { Component, inject, signal } from '@angular/core';
import { UsersFormComponent } from '../components/users-form/users-form.component';
import { UsersTableComponent } from '../components/users-table/users-table.component';
import { UsersStore } from '../services/users.signalStore';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { SpinnerComponent } from '../../../shared/loading-spinner.component';
import { AsyncPipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { User, UserEdit } from '../users-model/users.model';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [
    UsersFormComponent,
    UsersTableComponent,
    SpinnerComponent,
    AsyncPipe,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
  styles: `.edit-dialog{
    max-width:100%;
    width:100%;
    min-height:100%;
    height:100%;
    background-color:#aaaa;
    position:fixed;
    top:0;
    left:0;
    z-index:99;
  }
  .dialog{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background-color:#fff;
    border-radius:22px;
    padding:25px;
  }
  .edit-form{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    grid-template-rows:repeat(2,1fr);
    align-items:end;
    gap:30px;
  }
  .edit-form div{
    display:flex;
    flex-direction:column;
    gap:10px;
  }
  label{
    font-size:15px;
  }
  input{
    padding:10px;
    border:none;
    border:1px solid #aaa;
    border-radius:11px;
  }
 `,
})
export class UsersComponent {
  usersStore = inject(UsersStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  isOpen = signal<boolean>(false);
  form = new FormGroup({
    firstName: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    lastName: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  queryParams$ = this.route.queryParams.pipe(
    take(1),
    tap((params) => {
      console.log(params, `!!!!!!!!!!!!!!!!!`);
      this.usersStore.load(params);
    })
  );

  onDelete(id: number) {
    this.usersStore.deleteUser(id);
  }

  onHandleUserEdit() {
    if (this.form.invalid) return;
    const data = this.form.value;
    console.log(data);
  }

  onEdit(user: User) {
    this.isOpen.set(true);
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }

  onClose() {
    this.isOpen.set(false);
  }

  getUsers(params: any) {
    this.usersStore.load({ ...params, start: 0 });
    this.router.navigate(['/users'], {
      queryParams: {
        ...params,
      },
    });
  }

  onReset(params: any) {
    this.usersStore.load(params);
    this.router.navigate(['/users'], {
      queryParams: {},
    });
  }

  onPageChange(event: any) {
    const currentParams = this.usersStore.params();
    const start = event.pageIndex * event.pageSize;
    const limit = event.pageSize;
    this.usersStore.load({ start, limit });

    this.router.navigate(['/users'], {
      queryParams: {
        ...currentParams,
        start,
        limit,
      },
    });
  }
}
