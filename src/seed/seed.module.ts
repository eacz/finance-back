import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { SeedController } from './seed.controller';
import { AccountModule } from 'src/account/account.module';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [AuthModule, AccountModule, CurrencyModule],
})
export class SeedModule {}
