import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

import { Transaction } from './entities/transaction.entity';

import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule, AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}
