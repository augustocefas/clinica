import { IsUUID } from 'class-validator';

export class RemoveProfissionalFromSetorDto {
  @IsUUID()
  profissionalUuid: string;

  @IsUUID()
  tenancyUuid: string;
}
