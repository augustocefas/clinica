import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePacienteLogDto {
  @IsUUID()
  @IsNotEmpty()
  usersUuid: string;

  @IsUUID()
  @IsNotEmpty()
  tenancyUuid: string;

  @IsUUID()
  @IsNotEmpty()
  pacienteUuid: string;

  @IsNumber()
  @IsNotEmpty()
  dominioTipoAcessoId: number;
}
