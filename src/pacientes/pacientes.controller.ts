import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  findAll(@Query('tenancy') tenancyUuid?: string) {
    if (tenancyUuid) {
      return this.pacientesService.findByTenancy(tenancyUuid);
    }
    return this.pacientesService.findAll();
  }

  @Get('cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.pacientesService.findByCpf(cpf);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.pacientesService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(uuid, updatePacienteDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.pacientesService.remove(uuid);
  }
}
