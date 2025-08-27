import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';
import { SexoEnum } from '../entities/paciente.entity';

export class CreatePacienteDto {
  @IsString()
  @Length(1, 128)
  nome: string;

  @IsOptional()
  @IsString()
  @Length(11, 14)
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, {
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX ou XXXXXXXXXXX',
  })
  cpf?: string;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  rg?: string;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  emissor?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  emissorUf?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15)
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/, {
    message: 'Celular deve estar no formato (XX) XXXXX-XXXX ou XXXXXXXXXXX',
  })
  celular?: string;

  @IsOptional()
  @IsDateString()
  nascimento?: Date;

  @IsOptional()
  @IsEnum(SexoEnum)
  sexo?: SexoEnum = SexoEnum.OUTRO;

  @IsOptional()
  @IsString({ each: true })
  tenancyUuids?: string[]; // UUIDs dos tenancies aos quais o paciente pertence
}
