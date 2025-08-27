import { IsUUID, IsNotEmpty } from 'class-validator';

export class RemoveProcedimentoFromAgendaDto {
  @IsUUID()
  @IsNotEmpty()
  tenancyUuid: string;
}
