import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';

import { AuthModule } from 'src/auth/auth.module';

import { Currency } from './entities/currency.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Currency])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService, TypeOrmModule],
})
export class CurrencyModule {}
