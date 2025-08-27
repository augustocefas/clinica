import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddProcedimentoToAgendaDto {
  @IsUUID()
  @IsNotEmpty()
  procedimentoUuid: string;

  @IsUUID()
  @IsNotEmpty()
  tenancyUuid: string;
}
