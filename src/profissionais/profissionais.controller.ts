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
import { ProfissionaisService } from './profissionais.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';

@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly profissionaisService: ProfissionaisService) {}

  @Post()
  create(@Body() createProfissionalDto: CreateProfissionalDto) {
    return this.profissionaisService.create(createProfissionalDto);
  }

  @Get()
  findAll(@Query('tenancy') tenancyUuid?: string) {
    if (tenancyUuid) {
      return this.profissionaisService.findByTenancy(tenancyUuid);
    }
    return this.profissionaisService.findAll();
  }

  @Get('conselho/:conselho/:numero')
  findByConselho(
    @Param('conselho') conselho: string,
    @Param('numero') numero: string,
  ) {
    return this.profissionaisService.findByConselho(conselho, numero);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.profissionaisService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateProfissionalDto: UpdateProfissionalDto,
  ) {
    return this.profissionaisService.update(uuid, updateProfissionalDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.profissionaisService.remove(uuid);
  }
}
