import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { AddProcedimentoToAgendaDto } from './dto/add-procedimento-to-agenda.dto';
import { RemoveProcedimentoFromAgendaDto } from './dto/remove-procedimento-from-agenda.dto';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto);
  }

  @Get()
  findAll(@Query('tenancy') tenancy?: string) {
    if (tenancy) {
      return this.agendaService.findByTenancy(tenancy);
    }
    return this.agendaService.findAll();
  }

  @Get('paciente/:uuid')
  findByPaciente(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.findByPaciente(uuid);
  }

  @Get('profissional/:uuid')
  findByProfissional(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.findByProfissional(uuid);
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.agendaService.findAgendaByDate(date);
  }

  @Get('date-range')
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.agendaService.findByDateRange(start, end);
  }

  @Get('statistics/:tenancyUuid')
  getStatistics(
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.agendaService.getStatisticsByTenancy(
      tenancyUuid,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('availability/:profissionalUuid')
  checkAvailability(
    @Param('profissionalUuid', ParseUUIDPipe) profissionalUuid: string,
    @Query('date') date: string,
    @Query('inicio') inicio: string,
    @Query('fim') fim?: string,
  ) {
    return this.agendaService.checkAvailability(
      profissionalUuid,
      date,
      inicio,
      fim,
    );
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateAgendaDto: UpdateAgendaDto,
  ) {
    return this.agendaService.update(uuid, updateAgendaDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.remove(uuid);
  }

  // Endpoints para gerenciar procedimentos da agenda
  @Post(':uuid/procedimentos')
  addProcedimento(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() addProcedimentoDto: AddProcedimentoToAgendaDto,
  ) {
    return this.agendaService.addProcedimentoToAgenda(uuid, addProcedimentoDto);
  }

  @Get(':uuid/procedimentos')
  findProcedimentos(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.findAgendaProcedimentos(uuid);
  }

  @Get(':uuid/with-procedimentos')
  findWithProcedimentos(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.agendaService.findAgendaWithProcedimentos(uuid);
  }

  @Delete(':uuid/procedimentos/:procedimentoUuid')
  removeProcedimento(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('procedimentoUuid', ParseUUIDPipe) procedimentoUuid: string,
    @Body() removeProcedimentoDto: RemoveProcedimentoFromAgendaDto,
  ) {
    return this.agendaService.removeProcedimentoFromAgenda(
      uuid,
      procedimentoUuid,
      removeProcedimentoDto.tenancyUuid,
    );
  }
}
