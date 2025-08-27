import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';

@Controller('procedimentos')
export class ProcedimentosController {
  constructor(private readonly procedimentosService: ProcedimentosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProcedimentoDto: CreateProcedimentoDto) {
    return await this.procedimentosService.create(createProcedimentoDto);
  }

  @Get()
  async findAll(@Query('tenancy') tenancyUuid?: string) {
    if (tenancyUuid) {
      return await this.procedimentosService.findByTenancy(tenancyUuid);
    }
    return await this.procedimentosService.findAll();
  }

  @Get('statistics')
  async getStatistics(@Query('tenancy') tenancyUuid?: string) {
    return await this.procedimentosService.getStatistics(tenancyUuid);
  }

  @Get('nome/:nome')
  async findByNome(
    @Param('nome') nome: string,
    @Query('tenancy') tenancyUuid?: string,
  ) {
    return await this.procedimentosService.findByNome(nome, tenancyUuid);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return await this.procedimentosService.findOne(uuid);
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateProcedimentoDto: UpdateProcedimentoDto,
  ) {
    return await this.procedimentosService.update(uuid, updateProcedimentoDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid') uuid: string) {
    await this.procedimentosService.remove(uuid);
  }
}
