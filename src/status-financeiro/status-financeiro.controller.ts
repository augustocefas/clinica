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
import { StatusFinanceiroService } from './status-financeiro.service';
import { CreateStatusFinanceiroDto } from './dto/create-status-financeiro.dto';
import { UpdateStatusFinanceiroDto } from './dto/update-status-financeiro.dto';

@Controller('status-financeiro')
export class StatusFinanceiroController {
  constructor(
    private readonly statusFinanceiroService: StatusFinanceiroService,
  ) {}

  @Post()
  create(@Body() createStatusFinanceiroDto: CreateStatusFinanceiroDto) {
    return this.statusFinanceiroService.create(createStatusFinanceiroDto);
  }

  @Get()
  findAll() {
    return this.statusFinanceiroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusFinanceiroService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusFinanceiroDto: UpdateStatusFinanceiroDto,
  ) {
    return this.statusFinanceiroService.update(id, updateStatusFinanceiroDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusFinanceiroService.remove(id);
  }
}
