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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GrupoExameService } from './grupo-exame.service';
import { CreateGrupoExameDto } from './dto/create-grupo-exame.dto';
import { UpdateGrupoExameDto } from './dto/update-grupo-exame.dto';

@Controller('grupo-exame')
export class GrupoExameController {
  constructor(private readonly grupoExameService: GrupoExameService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGrupoExameDto: CreateGrupoExameDto) {
    return await this.grupoExameService.create(createGrupoExameDto);
  }

  @Get()
  async findAll(
    @Query('tenancyUuid') tenancyUuid?: string,
    @Query('setorId') setorId?: string,
  ) {
    return await this.grupoExameService.findAll(tenancyUuid, setorId);
  }

  @Get('statistics')
  async getStatistics(@Query('tenancyUuid') tenancyUuid?: string) {
    return await this.grupoExameService.getStatistics(tenancyUuid);
  }

  @Get('setor/:setorId')
  async findBySetor(
    @Param('setorId', ParseUUIDPipe) setorId: string,
    @Query('tenancyUuid') tenancyUuid: string,
  ) {
    return await this.grupoExameService.findBySetor(setorId, tenancyUuid);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.grupoExameService.findOne(uuid);
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateGrupoExameDto: UpdateGrupoExameDto,
  ) {
    return await this.grupoExameService.update(uuid, updateGrupoExameDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.grupoExameService.remove(uuid);
  }

  @Patch(':uuid/restore')
  async restore(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.grupoExameService.restore(uuid);
  }
}
