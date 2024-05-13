import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/createAccount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CurrencyService } from '../currency/currency.service';
import { User } from 'src/auth/entities/user.entity';
import { UpdateAccountFundsDto } from './dto/updateAccountFunds.dto';

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

    const hasRequestedAccount = await this.accountRepository.count({
      where: { user: { id: user.id }, currency: { id: currency.id } },
    });

    if (hasRequestedAccount) {
      throw new UnprocessableEntityException(
        `User already has a ${currency.code} account`,
      );
    }

    const account = this.accountRepository.create({
      ...createAccountDto,
      user: user,
      currency: currency,
    });

    await this.accountRepository.save(account);
    return account;
  }

  async getAccountById(id: number, userId: number) {
    const account = await this.accountRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['currency'],
    });

    if (!account) {
      throw new NotFoundException(`There is no account with id ${id}`);
    }

    return account;
  }

  async updateAccountFunds(
    id: number,
    { action, amount }: UpdateAccountFundsDto,
    userId: number,
  ) {
    const account = await this.accountRepository.findOne({
      where: { id, user: { id: userId } },
      select: {
        id: true,
        funds: true,
        updatedAt: true,
        currency: {
          id: true,
        },
      },

      relations: ['currency'],
    });

    if (!account) throw new NotFoundException(`There is account with id ${id}`);

    switch (action) {
      case 'ADD':
        account.funds = account.funds + amount;
        break;
      case 'SUBTRACT':
        if (account.funds - amount < 0) {
          throw new BadRequestException(
            `You don't have enough funds to do this operation`,
          );
        }
        account.funds = account.funds - amount;
        break;
      case 'SET':
        account.funds = amount;
        break;
    }
    await this.accountRepository.save(account);

    return account;
  }
}
