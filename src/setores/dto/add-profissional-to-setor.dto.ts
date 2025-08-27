import { IsUUID } from 'class-validator';

export class AddProfissionalToSetorDto {
  @IsUUID()
  profissionalUuid: string;

  @IsUUID()
  tenancyUuid: string;
}
