import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
      user: user,
    });
    await this.transactionRepository.save(transaction, {});
    return transaction;
  }

  async getTransactionById(id: number, user: User) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['account', 'currency', 'user'],
    });

    if (!transaction) {
      throw new NotFoundException(`There is no transaction with id ${id}`);
    }

    delete transaction.user;

    return transaction;
  }

  async getTransactionByUser(paginationDto: PaginationDto, user: User) {
    const limit = paginationDto.limit || 100;
    const offset = paginationDto.offset || 0;

    const transactions = await this.transactionRepository.find({
      where: { user: { id: user.id } },
      relations: ['currency'],
      order: { id: { direction: 'ASC' } },
      skip: offset,
      take: limit,
    });

    return transactions;
  }
}
