import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateCurrencyDto } from './dto/updateCurrency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('')
  @Auth()
  create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @getUser('id') userId: number,
  ) {
    return this.currencyService.create(createCurrencyDto, userId);
  }

  @Get('/all')
  @Auth()
  getAll() {
    return this.currencyService.getCurrencies();
  }

  @Put('/:id')
  @Auth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
    @getUser('id') userId: number,
  ) {
    return this.currencyService.updateCurrency(id, updateCurrencyDto, userId);
  }
}
