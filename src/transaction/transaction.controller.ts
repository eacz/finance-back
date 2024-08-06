import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Auth()
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @getUser() user: User,
  ) {
    return this.transactionService.createTransaction(
      createTransactionDto,
      user,
    );
  }

  @Patch('/:id')
  @Auth()
  revertTransaction(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: User,
  ) {
    return this.transactionService.revertTransaction(user, id);
  }

  @Get('/by-user')
  @Auth()
  getTransactionByUser(
    @Query() paginationDto: PaginationDto,
    @getUser() user: User,
  ) {
    return this.transactionService.getTransactionByUser(paginationDto, user);
  }

  @Get('/by-account/:accountId')
  @Auth()
  getTransactionByAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query() paginationDto: PaginationDto,
    @getUser() user: User,
  ) {
    return this.transactionService.getTransactionByAccount(
      paginationDto,
      user,
      accountId,
    );
  }

  @Get('/:id')
  @Auth()
  getTransactionById(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: User,
  ) {
    return this.transactionService.getTransactionById(id, user);
  }
}
