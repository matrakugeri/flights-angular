export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UsersResponse {
  total: number;
  data: User[];
}

export interface UserParams {
  limit: number;
  start: number;
  firstName: string | null;
  lastName: string | null;
}

export interface UsersState {
  data: User[];
  total: number;
  loading: boolean;
  error: string | null;
  loaded: boolean;
  params: UserParams;
}

export interface UserEdit {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}
