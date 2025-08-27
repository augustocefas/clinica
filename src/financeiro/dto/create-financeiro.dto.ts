import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MaxLength,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateFinanceiroDto {
  @IsUUID()
  tenancyUuid: string;

  @IsString()
  @MaxLength(64)
  numeroSequencial: string;

  @IsNumber()
  statusFinanceiroId: number;

  @IsNumber()
  @Min(0)
  valorOriginal: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  juros?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  multa?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorPago?: number = 0;

  @IsOptional()
  @IsDateString()
  dataVencimento?: string;

  @IsOptional()
  @IsDateString()
  dataPagamento?: string;
}
