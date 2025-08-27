import { PartialType } from '@nestjs/mapped-types';
import { CreateItensFinanceiroDto } from './create-itens-financeiro.dto';

export class UpdateItensFinanceiroDto extends PartialType(
  CreateItensFinanceiroDto,
) {}
