export class UserAuth {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthResponse {
  token: string;
  user: UserAuth
}
