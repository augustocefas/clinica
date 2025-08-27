import {
  IsUUID,
  IsString,
  IsOptional,
  MaxLength,
  IsDecimal,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProcedimentoDto {
  @IsUUID('4', { message: 'tenancyUuid deve ser um UUID válido' })
  tenancyUuid: string;

  @IsString({ message: 'nome deve ser uma string' })
  @MaxLength(255, { message: 'nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'abreviacao deve ser uma string' })
  @MaxLength(10, { message: 'abreviacao deve ter no máximo 10 caracteres' })
  abreviacao?: string;

  @IsOptional()
  @IsString({ message: 'tempoMedioMinutos deve ser uma string' })
  @MaxLength(3, {
    message: 'tempoMedioMinutos deve ter no máximo 3 caracteres',
  })
  @Matches(/^\d{1,3}$/, {
    message: 'tempoMedioMinutos deve ser um número de 1 a 3 dígitos',
  })
  tempoMedioMinutos?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'valor deve ser um valor decimal válido' },
  )
  @Min(0, { message: 'valor deve ser maior ou igual a 0' })
  valor?: number = 0;
}
