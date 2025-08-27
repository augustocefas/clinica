import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
  Length,
  Matches,
} from 'class-validator';

export class CreateExameDto {
  @IsUUID()
  tenancyUuid: string;

  @IsUUID()
  setorUuid: string;

  @IsUUID()
  pacienteUuid: string;

  @IsUUID()
  grupoexameUuid: string;

  @IsUUID()
  profissionalUuid: string;

  @IsString()
  @Length(1, 255)
  nome: string;

  @IsOptional()
  @IsDateString()
  dataExame?: Date;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'horarioInicioExame deve estar no formato HH:MM:SS',
  })
  horarioInicioExame?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'horarioFimExame deve estar no formato HH:MM:SS',
  })
  horarioFimExame?: string;

  @IsOptional()
  @IsDateString()
  previsaoLaudo?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 175)
  laudoNomeArquivo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 32)
  chaveAcesso?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4)
  contraChave?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor?: number = 0;
}
