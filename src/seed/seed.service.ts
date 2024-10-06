import { Injectable } from '@nestjs/common';
import { users } from './data/users';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  constructor(private readonly authService: AuthService) {}

  async generateSeed() {
    const users = await this.seedUsers();
  }

  private async seedUsers() {
    const usersWithHashedPassword = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));
    const usersPromises = usersWithHashedPassword.map((user) =>
      this.authService.create(user),
    );
    const createdUsers = await Promise.all(usersPromises);

    return createdUsers.map((u) => u.user);
  }
}
