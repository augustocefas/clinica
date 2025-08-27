import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  MaxLength,
  IsDecimal,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAgendaDto {
  @IsUUID('4', { message: 'tenancyUuid deve ser um UUID válido' })
  tenancyUuid: string;

  @IsUUID('4', { message: 'pacienteUuid deve ser um UUID válido' })
  pacienteUuid: string;

  @IsOptional()
  @IsUUID('4', { message: 'exameUuid deve ser um UUID válido' })
  exameUuid?: string;

  @IsUUID('4', { message: 'profissionalUuid deve ser um UUID válido' })
  profissionalUuid: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'dataConsulta deve estar no formato YYYY-MM-DD' },
  )
  dataConsulta?: string;

  @IsOptional()
  @IsString({ message: 'horarioInicio deve ser uma string' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horarioInicio deve estar no formato HH:MM',
  })
  horarioInicio?: string;

  @IsOptional()
  @IsString({ message: 'horarioFim deve ser uma string' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horarioFim deve estar no formato HH:MM',
  })
  horarioFim?: string;

  @IsOptional()
  @IsString({ message: 'recomendacao deve ser uma string' })
  @MaxLength(175, { message: 'recomendacao deve ter no máximo 175 caracteres' })
  recomendacao?: string;

  @IsOptional()
  @IsString({ message: 'obs deve ser uma string' })
  @MaxLength(175, { message: 'obs deve ter no máximo 175 caracteres' })
  obs?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'subtotal deve ser um valor decimal válido' },
  )
  @Min(0, { message: 'subtotal deve ser maior ou igual a 0' })
  subtotal?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'desconto deve ser um valor decimal válido' },
  )
  @Min(0, { message: 'desconto deve ser maior ou igual a 0' })
  desconto?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'recebido deve ser um valor decimal válido' },
  )
  @Min(0, { message: 'recebido deve ser maior ou igual a 0' })
  recebido?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'saldo deve ser um valor decimal válido' },
  )
  saldo?: number = 0;
}
