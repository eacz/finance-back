import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateAccountDto } from './dto/createAccount.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Auth()
  create(@Body() createAccountDto: CreateAccountDto, @getUser() user: User) {
    return this.accountService.create(createAccountDto, user);
  }

  @Get('/:id')
  @Auth()
  getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @getUser('id') userId: number,
  ) {
    return this.accountService.getAccountById(id, userId);
  }
}
