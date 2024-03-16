import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Currency } from 'src/currency/entities/currency.entity';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', { default: false })
  primary: boolean;

  @Column('float')
  funds: number;

  @OneToMany(() => Currency, (currency) => currency.accounts, {})
  currency: Currency;

  @ManyToOne(() => User, (user) => user.accounts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User;

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
