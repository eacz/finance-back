import { IsString, MinLength, IsOptional } from 'class-validator';

export class ModifyTransactionDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
