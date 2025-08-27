import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateEventoFinanceiroDto {
  @IsNumber()
  statusFinanceiroId: number;

  @IsUUID()
  financeiroUuid: string;

  @IsString()
  @MaxLength(128)
  evento: string;

  @IsOptional()
  @IsDateString()
  novaData?: string;
}
