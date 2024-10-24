import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from 'src/account/entities/account.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('boolean', { default: true })
  active: boolean;

  @Column()
  country: string;

  @OneToMany(() => Account, (account) => account.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  categories: Account[];

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
