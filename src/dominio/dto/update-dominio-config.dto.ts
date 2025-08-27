import { PartialType } from '@nestjs/mapped-types';
import { CreateDominioConfigDto } from './create-dominio-config.dto';

export class UpdateDominioConfigDto extends PartialType(
  CreateDominioConfigDto,
) {}
