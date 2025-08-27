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
import { SetoresService } from './setores.service';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { AddProfissionalToSetorDto } from './dto/add-profissional-to-setor.dto';
import { RemoveProfissionalFromSetorDto } from './dto/remove-profissional-from-setor.dto';
import { FilterSetoresDto } from './dto/filter-setores.dto';

@Controller('setores')
export class SetoresController {
  constructor(private readonly setoresService: SetoresService) {}

  @Post()
  create(@Body() createSetorDto: CreateSetorDto) {
    return this.setoresService.create(createSetorDto);
  }

  @Get()
  findAll(
    @Query('tenancy') tenancyUuid?: string,
    @Query('ativo') ativo?: string,
    @Query('with-relations') withRelations?: string,
  ) {
    if (tenancyUuid && withRelations === 'true') {
      return this.setoresService.findByTenancyWithRelations(tenancyUuid);
    }
    if (tenancyUuid && ativo === 'true') {
      return this.setoresService.findActiveByTenancy(tenancyUuid);
    }
    if (tenancyUuid) {
      return this.setoresService.findByTenancy(tenancyUuid);
    }
    return this.setoresService.findAll();
  }

  @Get('search')
  findWithFilters(@Query() filterDto: FilterSetoresDto) {
    return this.setoresService.findWithFilters(filterDto);
  }

  @Get('stats/:tenancyUuid')
  getSetorStats(@Param('tenancyUuid') tenancyUuid: string) {
    return this.setoresService.getSetorStats(tenancyUuid);
  }

  @Get('nome/:tenancy/:nome')
  findByNome(
    @Param('tenancy') tenancyUuid: string,
    @Param('nome') nome: string,
  ) {
    return this.setoresService.findByNome(tenancyUuid, nome);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid') uuid: string,
    @Query('with-relations') withRelations?: string,
  ) {
    if (withRelations === 'true') {
      return this.setoresService.findOneWithRelations(uuid);
    }
    return this.setoresService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateSetorDto: UpdateSetorDto) {
    return this.setoresService.update(uuid, updateSetorDto);
  }

  @Patch(':uuid/toggle-ativo')
  toggleAtivo(@Param('uuid') uuid: string) {
    return this.setoresService.toggleAtivo(uuid);
  }

  // Endpoints para gerenciar relacionamento setor-profissional
  @Post(':uuid/profissionais')
  addProfissionalToSetor(
    @Param('uuid') setorUuid: string,
    @Body() addProfissionalDto: AddProfissionalToSetorDto,
  ) {
    return this.setoresService.addProfissionalToSetor(
      setorUuid,
      addProfissionalDto,
    );
  }

  @Delete(':uuid/profissionais')
  removeProfissionalFromSetor(
    @Param('uuid') setorUuid: string,
    @Body() removeProfissionalDto: RemoveProfissionalFromSetorDto,
  ) {
    return this.setoresService.removeProfissionalFromSetor(
      setorUuid,
      removeProfissionalDto,
    );
  }

  @Get(':uuid/profissionais')
  getProfissionaisBySetor(
    @Param('uuid') setorUuid: string,
    @Query('tenancy') tenancyUuid: string,
  ) {
    return this.setoresService.getProfissionaisBySetor(setorUuid, tenancyUuid);
  }

  @Get('profissionais/:profissionalUuid')
  getSetoresByProfissional(
    @Param('profissionalUuid') profissionalUuid: string,
    @Query('tenancy') tenancyUuid: string,
  ) {
    return this.setoresService.getSetoresByProfissional(
      profissionalUuid,
      tenancyUuid,
    );
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.setoresService.remove(uuid);
  }
}
