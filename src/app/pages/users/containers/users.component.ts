import { Component, inject } from '@angular/core';
import { UsersFormComponent } from '../components/users-form/users-form.component';
import { UsersTableComponent } from '../components/users-table/users-table.component';
import { UsersStore } from '../services/users.signalStore';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { SpinnerComponent } from '../../../shared/loading-spinner.component';
import { AsyncPipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  imports: [
    UsersFormComponent,
    UsersTableComponent,
    SpinnerComponent,
    AsyncPipe,
    MatPaginatorModule,
  ],
  templateUrl: './users.component.html',
  styles: ``,
})
export class UsersComponent {
  usersStore = inject(UsersStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  queryParams$ = this.route.queryParams.pipe(
    take(1),
    tap((params) => {
      console.log(params, `!!!!!!!!!!!!!!!!!`);
      this.usersStore.load(params);
    })
  );

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
