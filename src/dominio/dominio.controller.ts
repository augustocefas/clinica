import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DominioService } from './dominio.service';
import { CreateDominioDto } from './dto/create-dominio.dto';
import { UpdateDominioDto } from './dto/update-dominio.dto';
import { CreateTipoDominioDto } from './dto/create-tipo-dominio.dto';
import { UpdateTipoDominioDto } from './dto/update-tipo-dominio.dto';
import { CreateDominioConfigDto } from './dto/create-dominio-config.dto';
import { UpdateDominioConfigDto } from './dto/update-dominio-config.dto';
import { CreateTipoDominioConfigDto } from './dto/create-tipo-dominio-config.dto';
import { UpdateTipoDominioConfigDto } from './dto/update-tipo-dominio-config.dto';

@Controller('dominio')
export class DominioController {
  constructor(private readonly dominioService: DominioService) {}

  // Endpoints para Dominio
  @Post()
  createDominio(@Body() createDominioDto: CreateDominioDto) {
    return this.dominioService.createDominio(createDominioDto);
  }

  @Get()
  findAllDominios() {
    return this.dominioService.findAllDominios();
  }

  @Get(':id')
  findOneDominio(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.findOneDominio(id);
  }

  @Patch(':id')
  updateDominio(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDominioDto: UpdateDominioDto,
  ) {
    return this.dominioService.updateDominio(id, updateDominioDto);
  }

  @Delete(':id')
  removeDominio(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.removeDominio(id);
  }

  // Endpoints para TipoDominio
  @Post('tipo')
  createTipoDominio(@Body() createTipoDominioDto: CreateTipoDominioDto) {
    return this.dominioService.createTipoDominio(createTipoDominioDto);
  }

  @Get('tipo')
  findAllTipoDominios() {
    return this.dominioService.findAllTipoDominios();
  }

  @Get('tipo/:id')
  findOneTipoDominio(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.findOneTipoDominio(id);
  }

  @Patch('tipo/:id')
  updateTipoDominio(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDominioDto: UpdateTipoDominioDto,
  ) {
    return this.dominioService.updateTipoDominio(id, updateTipoDominioDto);
  }

  @Delete('tipo/:id')
  removeTipoDominio(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.removeTipoDominio(id);
  }

  // Endpoints para DominioConfig
  @Post('config')
  createDominioConfig(@Body() createDominioConfigDto: CreateDominioConfigDto) {
    return this.dominioService.createDominioConfig(createDominioConfigDto);
  }

  @Get('config')
  findAllDominioConfigs() {
    return this.dominioService.findAllDominioConfigs();
  }

  @Get('config/:id')
  findOneDominioConfig(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.findOneDominioConfig(id);
  }

  @Patch('config/:id')
  updateDominioConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDominioConfigDto: UpdateDominioConfigDto,
  ) {
    return this.dominioService.updateDominioConfig(id, updateDominioConfigDto);
  }

  @Delete('config/:id')
  removeDominioConfig(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.removeDominioConfig(id);
  }

  // Endpoints para TipoDominioConfig
  @Post('config/tipo')
  createTipoDominioConfig(
    @Body() createTipoDominioConfigDto: CreateTipoDominioConfigDto,
  ) {
    return this.dominioService.createTipoDominioConfig(
      createTipoDominioConfigDto,
    );
  }

  @Get('config/tipo')
  findAllTipoDominioConfigs() {
    return this.dominioService.findAllTipoDominioConfigs();
  }

  @Get('config/tipo/:id')
  findOneTipoDominioConfig(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.findOneTipoDominioConfig(id);
  }

  @Patch('config/tipo/:id')
  updateTipoDominioConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDominioConfigDto: UpdateTipoDominioConfigDto,
  ) {
    return this.dominioService.updateTipoDominioConfig(
      id,
      updateTipoDominioConfigDto,
    );
  }

  @Delete('config/tipo/:id')
  removeTipoDominioConfig(@Param('id', ParseIntPipe) id: number) {
    return this.dominioService.removeTipoDominioConfig(id);
  }
}
