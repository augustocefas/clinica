import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDominioDto } from './create-tipo-dominio.dto';

export class UpdateTipoDominioDto extends PartialType(CreateTipoDominioDto) {}
