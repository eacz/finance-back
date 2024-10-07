import { CreateTransactionDto } from 'src/transaction/dto/createTransaction.dto';

import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/auth/entities/user.entity';
import { TransactionType } from 'src/transaction/entities/transaction.entity';


interface getTransactionsResult {
  transaction: CreateTransactionDto;
  user: User;
}
export const getTransactions = (
  account: Account[],
): getTransactionsResult[] => {
  const totalTransactions = transactions.map((transaction) => {
    const accountTransactions = account.map((account) => ({
      transaction: { ...transaction, account: account.id },
      user: account.user,
    }));
    return accountTransactions;
  });

  return totalTransactions.flat();
};

const transactions = [
  {
    type: TransactionType.INCOME,
    title: 'Salary',
    description: 'Monthly salary',
    amount: 1000,
    account: 1,
  },
  {
    type: TransactionType.OUTCOME,
    title: 'T-shirt',
    description: 'cheap cheap',
    amount: 20,
    account: 1,
  },
];
