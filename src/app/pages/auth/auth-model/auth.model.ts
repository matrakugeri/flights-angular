export interface User {
  token: string;
  user: UserDetails;
}

export interface UserDetails {
  email: string;
  id: number;
  role: 'admin' | 'user';
}
