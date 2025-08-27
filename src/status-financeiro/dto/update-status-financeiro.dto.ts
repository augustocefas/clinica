import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusFinanceiroDto } from './create-status-financeiro.dto';

export class UpdateStatusFinanceiroDto extends PartialType(
  CreateStatusFinanceiroDto,
) {}
