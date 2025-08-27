import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDominioConfigDto } from './create-tipo-dominio-config.dto';

export class UpdateTipoDominioConfigDto extends PartialType(
  CreateTipoDominioConfigDto,
) {}
