import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  funds: number;

  @IsInt()
  @Min(1)
  currency: number;
}
