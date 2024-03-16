import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CurrencyService } from '../currency/currency.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly currencyService: CurrencyService,
  ) {}

  async create(createAccountDto: CreateAccountDto, user: User) {
    const currency = await this.currencyService.getCurrencyById(
      createAccountDto.currency,
    );

    const account = this.accountRepository.create({
      ...createAccountDto,
      user: user,
      currency: currency,
    });

    await this.accountRepository.save(account);
    return account;
  }
}
