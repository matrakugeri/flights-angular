export interface User {
  token: string;
  user: User2;
}

export interface User2 {
  email: string;
  id: number;
}
