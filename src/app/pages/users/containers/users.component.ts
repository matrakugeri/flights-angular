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
  styles: `
    @use 'sass:color';

    .edit-dialog {
    max-width: 100%;
    width: 100%;
    min-height: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.4);
    animation: fadeIn 0.3s ease;
  }

  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: 22px;
    padding: 30px;
  }
  .edit-form {
    display: grid;
    grid-template-columns:repeat(2, 1fr);
    grid-template-rows:repeat(2, 1fr);
    align-items: end;
    gap: 40px;
  }

  .edit-form div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position:relative;
  }

  label {
    font-size: 15px;
  }

  input {
    padding: 10px;
    border: 1px solid #aaa;
    border-radius: 11px;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .dialog__title {
    font-size: 2rem;
    font-weight: 600;
    color: #333030ff;
    margin-bottom: 25px;
  }
.control-error-form{
  position:absolute;
  bottom:-32px;
  font-size:11px;
  color:red;
}
.control-email{
  position:absolute;
  bottom:-18px;
  font-size:11px;
  color:red;
}
  .btn-save {
    padding: 10px;
    border: none;
    border-radius: 11px;
    background-color: #dcae56;
    letter-spacing:1px;
    font-weight: 600;
    color:#fff;
    cursor:pointer;
    text-transform: uppercase;
  }
  .reminder{
    color: color.adjust(rgb(52, 123, 189),$lightness:10%);
    font-size:1.2rem;
    margin-top: 35px;
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
