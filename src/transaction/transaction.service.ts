import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OpositeType,
  Transaction,
  TransactionType,
} from './entities/transaction.entity';
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
    createTransactionDto: CreateTransactionDto | Transaction,
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
      order: { createdAt: { direction: 'DESC' } },
      skip: offset,
      take: limit,
    });

    return transactions;
  }

  async getTransactionByAccount(
    paginationDto: PaginationDto,
    user: User,
    accountId: number,
  ) {
    const limit = paginationDto.limit || 100;
    const offset = paginationDto.offset || 0;

    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('user_id = :userId', { userId: user.id })
      .andWhere('account_id = :accountId', { accountId })
      .skip(offset)
      .take(limit)
      .orderBy('transaction.createdAt', 'DESC')
      .getMany();

    return transactions;
  }

  async revertTransaction(user: User, id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { user: { id: user.id }, id },
    });

    if (!transaction) {
      throw new NotFoundException(`There is no transaction with id ${id}`);
    }

    const revertedTransaction: Transaction = {
      ...transaction,
      type: TransactionType[OpositeType[transaction.type]],
      title: `Operation reversed Nro #${transaction.id} - ${transaction.title}`,
    };
    delete revertedTransaction.id;

    return await this.createTransaction(revertedTransaction, user);
  }
}
