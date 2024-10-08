import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthService } from 'src/auth/auth.service';
import { CurrencyService } from 'src/currency/currency.service';
import { AccountService } from 'src/account/account.service';
import { TransactionService } from 'src/transaction/transaction.service';

import { currencies } from './data/currencies';
import { users } from './data/users';
import { getTransactions } from './data/transactions';

import { UserAuth } from 'src/auth/interfaces/authResponse';

import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/auth/entities/user.entity';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
    private readonly transactionService: TransactionService,
  ) {}

  async generateSeed() {
    await this.accountRepository.delete({});
    await this.currencyRepository.delete({});
    await this.userRepository.delete({});

    const users = await this.seedUsers();
    const currencies = await this.seedCurrencies();
    const accounts = await this.seedAccounts(users, currencies);
    const transactions = await this.seedTransactions(accounts);

    return {ok: true, message: 'Seed executed'}
  }

  private async seedUsers() {
    const usersPromises = users.map((user) =>
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

  private async seedTransactions(accounts: Account[]) {
    const transactionsToCreate = getTransactions(accounts);
    const transactionsPromises = transactionsToCreate.map((t) =>
      this.transactionService.createTransaction(t.transaction, t.user),
    );
    const transactions = await Promise.all(transactionsPromises);
    return transactions;
  }
}
