import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SegmentoService } from './segmento.service';
import { CreateSegmentoDto } from './dto/create-segmento.dto';
import { UpdateSegmentoDto } from './dto/update-segmento.dto';

@Controller('segmento')
export class SegmentoController {
  constructor(private readonly segmentoService: SegmentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSegmentoDto: CreateSegmentoDto) {
    return await this.segmentoService.create(createSegmentoDto);
  }

  @Get()
  async findAll() {
    return await this.segmentoService.findAll();
  }

  @Get('statistics')
  async getStatistics() {
    return await this.segmentoService.getStatistics();
  }

  @Get('nome/:nome')
  async findByNome(@Param('nome') nome: string) {
    return await this.segmentoService.findByNome(nome);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.segmentoService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSegmentoDto: UpdateSegmentoDto,
  ) {
    return await this.segmentoService.update(id, updateSegmentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.segmentoService.remove(id);
  }
}
