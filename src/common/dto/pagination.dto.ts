import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  offset?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number;
}
