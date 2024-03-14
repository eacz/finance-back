import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @MinLength(3)
  @MaxLength(5)
  code: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNumber()
  valueAgainstPrimary: number;
}
