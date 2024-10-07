import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';
import { CurrencyModule } from 'src/currency/currency.module';
import { TransactionModule } from 'src/transaction/transaction.module';

import { Account } from 'src/account/entities/account.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { User } from 'src/auth/entities/user.entity';


@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [
    TypeOrmModule.forFeature([Account, Currency, User]),
    AuthModule,
    AccountModule,
    CurrencyModule,
    TransactionModule
  ],
})
export class SeedModule {}
