import { Injectable } from '@nestjs/common';
import { users } from './data/users';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { UserAuth } from 'src/auth/interfaces/authResponse';
import { CurrencyService } from 'src/currency/currency.service';
import { currencies } from './data/currencies';
import { Currency } from 'src/currency/entities/currency.entity';
import { AccountService } from 'src/account/account.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
  ) {}

  async generateSeed() {
    const users = await this.seedUsers();
    const currencies = await this.seedCurrencies();
    const accounts = await this.seedAccounts(users, currencies);
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

  private async seedAccounts(users: UserAuth[], currencies: Currency[]) {
    const accountsPromises = users.map((user) => {
      const accounts = currencies.map((currency) =>
        this.accountService.create(
          { funds: 1000, currency: currency.id },
          user as User,
        ),
      );
      return accounts;
    });

    const accountFlated = accountsPromises.flat();
    const createdAccount = await Promise.all(accountFlated);

    return createdAccount;
  }

  private async seedCurrencies() {
    const currenciesPromises = currencies.map((currency) =>
      this.currencyService.create(currency, 1),
    );

    const currenciesCreated = await Promise.all(currenciesPromises);

    return currenciesCreated;
  }
}
