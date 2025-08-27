import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) {}

  @Post()
  create(@Body() createSolicitacaoDto: CreateSolicitacaoDto) {
    return this.solicitacaoService.create(createSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.solicitacaoService.findAll();
  }

  @Get('agenda/:agendaUuid')
  findByAgenda(@Param('agendaUuid', ParseUUIDPipe) agendaUuid: string) {
    return this.solicitacaoService.findByAgenda(agendaUuid);
  }

  @Get(':agendaUuid/:descricao')
  findOne(
    @Param('agendaUuid', ParseUUIDPipe) agendaUuid: string,
    @Param('descricao') descricao: string,
  ) {
    return this.solicitacaoService.findOne(agendaUuid, descricao);
  }

  @Patch(':agendaUuid/:descricao')
  update(
    @Param('agendaUuid', ParseUUIDPipe) agendaUuid: string,
    @Param('descricao') descricao: string,
    @Body() updateSolicitacaoDto: UpdateSolicitacaoDto,
  ) {
    return this.solicitacaoService.update(
      agendaUuid,
      descricao,
      updateSolicitacaoDto,
    );
  }

  @Delete(':agendaUuid/:descricao')
  remove(
    @Param('agendaUuid', ParseUUIDPipe) agendaUuid: string,
    @Param('descricao') descricao: string,
  ) {
    return this.solicitacaoService.remove(agendaUuid, descricao);
  }

  @Delete('agenda/:agendaUuid')
  removeByAgenda(@Param('agendaUuid', ParseUUIDPipe) agendaUuid: string) {
    return this.solicitacaoService.removeByAgenda(agendaUuid);
  }
}
