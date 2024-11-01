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
import { ModifyTransactionDto } from './dto/modifyTransaction.dto';
import { GetTransactionsDto } from './dto/getTransactions.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
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
    if (createTransactionDto.categoryId) {
      const category = await this.categoryService.getCategoryById(
        createTransactionDto.categoryId,
        user,
      );
      transaction.category = category;
    }
    await this.transactionRepository.save(transaction, {});
    return transaction;
  }

  async getTransactionById(id: number, user: User) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['account', 'currency', 'user', 'category'],
      select: {
        category: {
          id: true,
          name: true,
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`There is no transaction with id ${id}`);
    }

    delete transaction.user;

    return transaction;
  }

  async getTransactionByUser(
    getTransactionsDto: GetTransactionsDto,
    user: User,
  ) {
    const limit = getTransactionsDto.limit || 10;
    const offset = getTransactionsDto.offset || 0;

    const transactionsQuery = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('user_id = :userId', { userId: user.id })
      .innerJoinAndSelect(
        'currency',
        'currency',
        'transaction.currency_id = currency.id',
      )
      .offset(offset)
      .limit(limit)
      .orderBy('transaction.createdAt', 'DESC');

    const totalQuery = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('user_id = :userId', { userId: user.id });

    if (getTransactionsDto.account) {
      transactionsQuery.andWhere('account_id = :accountId', {
        accountId: getTransactionsDto.account,
      });
      totalQuery.andWhere('account_id = :accountId', {
        accountId: getTransactionsDto.account,
      });
    }

    if (getTransactionsDto.textFilter) {
      transactionsQuery.andWhere('LOWER(title) like LOWER(:text)', {
        text: `%${getTransactionsDto.textFilter}%`,
      });
      totalQuery.andWhere('LOWER(title) like LOWER(:text)', {
        text: `%${getTransactionsDto.textFilter}%`,
      });
    }

    if (getTransactionsDto.category) {
      transactionsQuery.andWhere('category_id = :category', {
        category: getTransactionsDto.category,
      });
      totalQuery.andWhere('category_id = :category', {
        category: getTransactionsDto.category,
      });
    }

    const transactionsRaw = await transactionsQuery.getRawMany();
    const transactions = this.buildTransactionWithCurrency(transactionsRaw);
    const total = await totalQuery.getCount();

    return { transactions, total };
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

    const total = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('user_id = :userId', { userId: user.id })
      .andWhere('account_id = :accountId', { accountId })
      .getCount();

    return { transactions, total: total };
  }

  async modifyTransaction(
    id: number,
    modifyTransactionDto: ModifyTransactionDto,
    user: User,
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: { user: { id: user.id }, id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException(`There is no transaction with id ${id}`);
    }

    const { title, description } = modifyTransactionDto;

    const toUpdate = {
      description: description ?? transaction.description,
      title: title ?? transaction.title,
    };

    let categoryToUpdate = null

    if (modifyTransactionDto.category) {
      const category = await this.categoryService.getCategoryById(
        modifyTransactionDto.category,
        user,
      );
      categoryToUpdate = category;
    }

    const res = await this.transactionRepository.update({ id }, {...toUpdate, category: categoryToUpdate});
    if (res.affected === 0) {
      return { ok: false };
    }
    return { ok: true };
  }

  async revertTransaction(user: User, id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { user: { id: user.id }, id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new NotFoundException(`There is no transaction with id ${id}`);
    }

    //TODO: fix this workaround till i fix type issues
    const account: any = transaction.account;

    const revertedTransaction: Transaction = {
      ...transaction,
      account: account.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TransactionType[OpositeType[transaction.type]],
      title: `Operation reversed Nro #${transaction.id} - ${transaction.title}`,
    };
    delete revertedTransaction.id;

    return await this.createTransaction(revertedTransaction, user);
  }

  private buildTransactionWithCurrency(transactions: any[]) {
    return transactions.map((transaction) => {
      const obj = {};
      Object.keys(transaction).map((key) => {
        if (key.includes('transaction')) {
          const newKey = key.split('transaction_').at(1);
          obj[newKey] = transaction[key];
        } else if (key.includes('currency')) {
          const newKey = key.split('currency_').at(1);
          obj['currency'] = { ...obj['currency'], [newKey]: transaction[key] };
        }
      });
      return obj;
    });
  }
}
