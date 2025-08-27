import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { EventoFinanceiroService } from './evento-financeiro.service';
import { CreateEventoFinanceiroDto } from './dto/create-evento-financeiro.dto';
import { UpdateEventoFinanceiroDto } from './dto/update-evento-financeiro.dto';

@Controller('evento-financeiro')
export class EventoFinanceiroController {
  constructor(
    private readonly eventoFinanceiroService: EventoFinanceiroService,
  ) {}

  @Post()
  create(@Body() createEventoFinanceiroDto: CreateEventoFinanceiroDto) {
    return this.eventoFinanceiroService.create(createEventoFinanceiroDto);
  }

  @Get()
  findAll(@Query('evento') evento?: string) {
    if (evento) {
      return this.eventoFinanceiroService.findByEvento(evento);
    }
    return this.eventoFinanceiroService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.eventoFinanceiroService.findOne(uuid);
  }

  @Get('financeiro/:financeiroUuid')
  findByFinanceiro(
    @Param('financeiroUuid', ParseUUIDPipe) financeiroUuid: string,
  ) {
    return this.eventoFinanceiroService.findByFinanceiro(financeiroUuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateEventoFinanceiroDto: UpdateEventoFinanceiroDto,
  ) {
    return this.eventoFinanceiroService.update(uuid, updateEventoFinanceiroDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.eventoFinanceiroService.remove(uuid);
  }
}
