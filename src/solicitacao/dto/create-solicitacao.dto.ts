import { IsUUID, IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateSolicitacaoDto {
  @IsUUID('4', { message: 'agendaUuid deve ser um UUID válido' })
  @IsNotEmpty({ message: 'agendaUuid é obrigatório' })
  agendaUuid: string;

  @IsString({ message: 'descricao deve ser uma string' })
  @MaxLength(175, { message: 'descricao não pode ter mais de 175 caracteres' })
  @IsNotEmpty({ message: 'descricao é obrigatória' })
  descricao: string;
}
