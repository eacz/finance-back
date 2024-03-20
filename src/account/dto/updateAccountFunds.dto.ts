import { IsEnum, IsNumber } from 'class-validator';

export class UpdateAccountFundsDto {
  @IsNumber()
  amount: number;

  @IsEnum(['ADD', 'SUBTRACT', 'SET'])
  action: 'ADD' | 'SUBTRACT' | 'SET';
}
