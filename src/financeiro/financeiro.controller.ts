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
import { FinanceiroService } from './financeiro.service';
import { CreateFinanceiroDto } from './dto/create-financeiro.dto';
import { UpdateFinanceiroDto } from './dto/update-financeiro.dto';

@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  @Post()
  create(@Body() createFinanceiroDto: CreateFinanceiroDto) {
    return this.financeiroService.create(createFinanceiroDto);
  }

  @Get()
  findAll() {
    return this.financeiroService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.financeiroService.findOne(uuid);
  }

  @Get('tenancy/:tenancyUuid')
  findByTenancy(@Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string) {
    return this.financeiroService.findByTenancy(tenancyUuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateFinanceiroDto: UpdateFinanceiroDto,
  ) {
    return this.financeiroService.update(uuid, updateFinanceiroDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.financeiroService.remove(uuid);
  }
}
