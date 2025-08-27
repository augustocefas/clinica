import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterSetoresDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsUUID()
  tenancyUuid?: string;

  @IsOptional()
  @IsString()
  search?: string; // Para busca geral por nome

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;

  @IsOptional()
  @IsString()
  orderBy?: 'nome' | 'createdAt' | 'updatedAt' = 'nome';

  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC' = 'ASC';
}
