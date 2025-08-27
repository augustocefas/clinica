import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateSetorDto {
  @IsUUID()
  tenancyUuid: string;

  @IsString()
  @Length(1, 255)
  nome: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}
