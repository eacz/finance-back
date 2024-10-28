import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from 'src/account/entities/account.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

export enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

export enum OpositeType {
  INCOME = 'OUTCOME',
  OUTCOME = 'INCOME',
}

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  amount: number;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: number;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'currency_id' })
  currency: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_id'})
  category: Category

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
