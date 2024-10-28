import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetCategoriesDto extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  showTransactionsAmount?: boolean;
}
