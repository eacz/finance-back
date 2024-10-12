import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule, AccountModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
