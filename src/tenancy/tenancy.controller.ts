import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { UpdateTenancyDto } from './dto/update-tenancy.dto';

@Controller('tenancy')
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) {}

  @Post()
  create(@Body() createTenancyDto: CreateTenancyDto) {
    return this.tenancyService.create(createTenancyDto);
  }

  @Get()
  findAll() {
    return this.tenancyService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.tenancyService.findOne(uuid);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tenancyService.findBySlug(slug);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateTenancyDto: UpdateTenancyDto,
  ) {
    return this.tenancyService.update(uuid, updateTenancyDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.tenancyService.remove(uuid);
  }
}
