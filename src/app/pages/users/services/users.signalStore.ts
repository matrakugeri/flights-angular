import {
  getState,
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  User,
  UserEdit,
  UserParams,
  UsersState,
} from '../users-model/users.model';
import { UsersService } from './users.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

const initialState: UsersState = {
  data: [],
  total: 0,
  loading: false,
  loaded: false,
  error: null,
  params: {
    limit: 10,
    start: 0,
    firstName: null,
    lastName: null,
  },
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      usersService = inject(UsersService),
      snackBar = inject(MatSnackBar)
    ) => ({
      state: (): UsersState => {
        return getState(store);
      },
      load: rxMethod<Partial<UserParams>>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((params: Partial<UserParams>) => {
            const newParams = { ...getState(store).params, ...params };
            console.log(newParams);
            return usersService.getUsers(newParams).pipe(
              tap({
                next: (response) => {
                  patchState(store, {
                    data: response.data,
                    total: response.total,
                    loaded: true,
                    loading: false,
                    error: null,
                    params: newParams,
                  });
                },
              }),
              catchError((err) => {
                console.log(err);
                patchState(store, {
                  error: err,
                  loading: false,
                  loaded: false,
                });
                return EMPTY;
              })
            );
          })
        )
      ),
      deleteUser: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((id: number) => {
            return usersService.deleteUser(id).pipe(
              tap({
                next: (response) => {
                  patchState(store, (state) => ({
                    data: state.data.filter((el) => el.id !== id),
                    total: state.total - 1,
                    loaded: true,
                    loading: false,
                    error: null,
                  }));
                  snackBar.open(
                    `You have successfully deleted the user with the id: ${id} `,
                    'Message',
                    {
                      duration: 3000,
                    }
                  );
                },
              }),
              catchError((err) => {
                console.log(err);
                patchState(store, {
                  error: err,
                  loading: false,
                  loaded: false,
                });
                return EMPTY;
              })
            );
          })
        )
      ),
      editUser: rxMethod<User>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((user: User) => {
            return usersService.editUser(user);
          })
        )
      ),
    })
  )
);
