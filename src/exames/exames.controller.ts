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
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  create(@Body() createExameDto: CreateExameDto) {
    return this.examesService.create(createExameDto);
  }

  @Get()
  findAll(
    @Query('tenancy') tenancyUuid?: string,
    @Query('paciente') pacienteUuid?: string,
    @Query('profissional') profissionalUuid?: string,
    @Query('setor') setorUuid?: string,
  ) {
    if (tenancyUuid) {
      return this.examesService.findByTenancy(tenancyUuid);
    }
    if (pacienteUuid) {
      return this.examesService.findByPaciente(pacienteUuid);
    }
    if (profissionalUuid) {
      return this.examesService.findByProfissional(profissionalUuid);
    }
    if (setorUuid) {
      return this.examesService.findBySetor(setorUuid);
    }
    return this.examesService.findAll();
  }

  @Get('chave/:chave')
  findByChaveAcesso(@Param('chave') chave: string) {
    return this.examesService.findByChaveAcesso(chave);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.examesService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateExameDto: UpdateExameDto) {
    return this.examesService.update(uuid, updateExameDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.examesService.remove(uuid);
  }
}
