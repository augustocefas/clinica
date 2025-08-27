import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PacienteLogService } from './paciente-log.service';
import { CreatePacienteLogDto } from './dto/create-paciente-log.dto';
import { UpdatePacienteLogDto } from './dto/update-paciente-log.dto';

@Controller('paciente-log')
export class PacienteLogController {
  constructor(private readonly pacienteLogService: PacienteLogService) {}

  @Post()
  create(@Body() createPacienteLogDto: CreatePacienteLogDto) {
    return this.pacienteLogService.create(createPacienteLogDto);
  }

  @Get()
  findAll() {
    return this.pacienteLogService.findAll();
  }

  @Get('paciente/:pacienteUuid')
  findByPaciente(@Param('pacienteUuid', ParseUUIDPipe) pacienteUuid: string) {
    return this.pacienteLogService.findByPaciente(pacienteUuid);
  }

  @Get('user/:usersUuid')
  findByUser(@Param('usersUuid', ParseUUIDPipe) usersUuid: string) {
    return this.pacienteLogService.findByUser(usersUuid);
  }

  @Get('tenancy/:tenancyUuid')
  findByTenancy(@Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string) {
    return this.pacienteLogService.findByTenancy(tenancyUuid);
  }

  @Get(':usersUuid/:tenancyUuid/:pacienteUuid/:dominioTipoAcessoId')
  findOne(
    @Param('usersUuid', ParseUUIDPipe) usersUuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
    @Param('pacienteUuid', ParseUUIDPipe) pacienteUuid: string,
    @Param('dominioTipoAcessoId', ParseIntPipe) dominioTipoAcessoId: number,
  ) {
    return this.pacienteLogService.findOne(
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
    );
  }

  @Patch(':usersUuid/:tenancyUuid/:pacienteUuid/:dominioTipoAcessoId')
  update(
    @Param('usersUuid', ParseUUIDPipe) usersUuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
    @Param('pacienteUuid', ParseUUIDPipe) pacienteUuid: string,
    @Param('dominioTipoAcessoId', ParseIntPipe) dominioTipoAcessoId: number,
    @Body() updatePacienteLogDto: UpdatePacienteLogDto,
  ) {
    return this.pacienteLogService.update(
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
      updatePacienteLogDto,
    );
  }

  @Delete(':usersUuid/:tenancyUuid/:pacienteUuid/:dominioTipoAcessoId')
  remove(
    @Param('usersUuid', ParseUUIDPipe) usersUuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
    @Param('pacienteUuid', ParseUUIDPipe) pacienteUuid: string,
    @Param('dominioTipoAcessoId', ParseIntPipe) dominioTipoAcessoId: number,
  ) {
    return this.pacienteLogService.remove(
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
    );
  }

  @Post('registrar-acesso')
  registrarAcesso(@Body() createPacienteLogDto: CreatePacienteLogDto) {
    return this.pacienteLogService.registrarAcesso(
      createPacienteLogDto.usersUuid,
      createPacienteLogDto.tenancyUuid,
      createPacienteLogDto.pacienteUuid,
      createPacienteLogDto.dominioTipoAcessoId,
    );
  }
}
