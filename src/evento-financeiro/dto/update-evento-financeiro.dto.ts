import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoFinanceiroDto } from './create-evento-financeiro.dto';

export class UpdateEventoFinanceiroDto extends PartialType(
  CreateEventoFinanceiroDto,
) {}
