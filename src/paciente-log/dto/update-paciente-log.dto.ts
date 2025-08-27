import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteLogDto } from './create-paciente-log.dto';

export class UpdatePacienteLogDto extends PartialType(CreatePacienteLogDto) {}
