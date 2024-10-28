import { IsOptional, Min, IsInt, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetTransactionsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  account?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  category?: number;

  @IsOptional()
  @IsString()
  textFilter?: string;
}
