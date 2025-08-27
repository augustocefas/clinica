import {
  IsString,
  IsOptional,
  IsUUID,
  Length,
  IsNumberString,
} from 'class-validator';

export class CreateProfissionalDto {
  @IsString()
  @Length(1, 128)
  nome: string;

  @IsOptional()
  @IsString()
  @Length(1, 32)
  conselho?: string; // CRM, CRP, CRO, etc.

  @IsOptional()
  @IsString()
  @Length(1, 32)
  numeroConselho?: string; // Número do conselho profissional

  @IsOptional()
  @IsString()
  @Length(1, 64)
  especialidade?: string; // Especialidade do profissional

  @IsNumberString()
  @Length(1, 32)
  somaTempoConsulta: string; // minutos

  @IsUUID()
  tenancyUuid: string;
}
