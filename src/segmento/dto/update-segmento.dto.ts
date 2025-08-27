import { PartialType } from '@nestjs/mapped-types';
import { CreateSegmentoDto } from './create-segmento.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSegmentoDto extends PartialType(CreateSegmentoDto) {
  @IsOptional()
  @IsString({ message: 'nome deve ser uma string' })
  @MinLength(2, { message: 'nome deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'nome deve ter no máximo 255 caracteres' })
  nome?: string;

  @IsOptional()
  @IsNumber({}, { message: 'intervaloAlerta deve ser um número' })
  @Min(1, { message: 'intervaloAlerta deve ser maior que 0' })
  @Max(8760, {
    message: 'intervaloAlerta deve ser no máximo 8760 horas (1 ano)',
  })
  @Transform(({ value }) => parseInt(value))
  intervaloAlerta?: number;
}
