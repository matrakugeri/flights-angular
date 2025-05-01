import { signalStore, withState } from '@ngrx/signals';
import { UsersState } from '../users-model/users.model';

const initialState: UsersState = {
  data: [],
  total: 0,
  isLoading: false,
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
  withState(initialState)
);
