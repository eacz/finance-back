import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getCurrenciesResponse } from './interfaces/getCurrenciesResponse.interface';
import { UpdateCurrencyDto } from './dto/updateCurrency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto, userId: number) {
    //until I create roles auth system
    if (userId !== 1) throw new UnauthorizedException();

    try {
      const currency = this.currencyRepository.create(createCurrencyDto);
      await this.currencyRepository.save(currency);
      return currency;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async getCurrencies(): Promise<getCurrenciesResponse[]> {
    const currencies = await this.currencyRepository.find({
      select: ['code', 'id', 'name'],
    });

    return currencies;
  }

  async updateCurrency(
    currencyId: number,
    updateCurrencyDto: UpdateCurrencyDto,
    userId: number,
  ) {
    //until I create roles auth system
    if (userId !== 1) throw new UnauthorizedException();

    try {
      const result = await this.currencyRepository.update(
        { id: currencyId },
        updateCurrencyDto,
      );
      if (result.affected) {
        return 'updated successfully';
      }
      throw new NotFoundException(`There is no currency with id ${currencyId}`);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      let message = error.detail.includes('code') ? 'code' : 'name';
      message += ' already used';
      throw new ConflictException(message);
    } else {
      throw error;
    }
  }
}
