import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsIn,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGrupoExameDto {
  @IsUUID(4, { message: 'setorId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'setorId é obrigatório' })
  setorId: string;

  @IsString({ message: 'nome deve ser uma string' })
  @IsNotEmpty({ message: 'nome é obrigatório' })
  @MinLength(2, { message: 'nome deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'detalhamento deve ser uma string' })
  @MaxLength(255, { message: 'detalhamento deve ter no máximo 255 caracteres' })
  detalhamento?: string;

  @IsOptional()
  @IsString({ message: 'descricao deve ser uma string' })
  @MaxLength(255, { message: 'descricao deve ter no máximo 255 caracteres' })
  descricao?: string;

  @IsOptional()
  @IsIn(['horas', 'dias'], {
    message: 'previsaoTempo deve ser "horas" ou "dias"',
  })
  previsaoTempo?: 'horas' | 'dias';

  @IsOptional()
  @IsString({ message: 'previsaoLaudoTempo deve ser uma string' })
  @MaxLength(255, {
    message: 'previsaoLaudoTempo deve ter no máximo 255 caracteres',
  })
  previsaoLaudoTempo?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'valor deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, { message: 'valor deve ser maior ou igual a 0' })
  @Transform(({ value }) => parseFloat(value))
  valor?: number;

  @IsUUID(4, { message: 'tenancyUuid deve ser um UUID válido' })
  @IsNotEmpty({ message: 'tenancyUuid é obrigatório' })
  tenancyUuid: string;
}
