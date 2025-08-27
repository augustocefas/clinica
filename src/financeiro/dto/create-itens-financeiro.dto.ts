import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateItensFinanceiroDto {
  @IsUUID()
  financeiroUuid: string;

  @IsUUID()
  tenancyUuid: string;

  @IsString()
  @MaxLength(175)
  descricao: string;

  @IsNumber()
  @Min(0)
  quantidade: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorUnit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorTotal?: number;
}
