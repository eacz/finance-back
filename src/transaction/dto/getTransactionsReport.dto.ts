import { IsOptional, Min, IsInt, IsString } from 'class-validator';

export class GetTransactionsReportDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  account?: number;

  @IsOptional()
  @IsString()
  textFilter?: string;
}
