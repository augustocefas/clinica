import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindPlanosDto extends PaginationDto {
  @IsOptional()
  @IsString()
  active?: string;
}
