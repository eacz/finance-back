import { IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';

export class ModifyTransactionDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  category?: number;
}
