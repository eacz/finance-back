import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';

import { Account } from './entities/account.entity';
import { Currency } from 'src/currency/entities/currency.entity';

import { CurrencyModule } from 'src/currency/currency.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Currency]),
    CurrencyModule,
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
