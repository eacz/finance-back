import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from 'src/account/entities/account.entity';
import { Currency } from 'src/currency/entities/currency.entity';

enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  amount: number;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
