import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ) {
    const account = await this.accountService.updateAccountFunds(
      createTransactionDto.account,
      {
        action: createTransactionDto.type === 'INCOME' ? 'ADD' : 'SUBTRACT',
        amount: createTransactionDto.amount,
      },
      user.id,
    );

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      currency: account.currency.id,
      account: account.id,
    });
    await this.transactionRepository.save(transaction, {});
    return transaction;
  }
}
