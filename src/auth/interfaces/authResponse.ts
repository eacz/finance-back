export class AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    country: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
