import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

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
}
