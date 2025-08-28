import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { FindPlanosDto } from './dto/find-planos.dto';

@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Post()
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  @Get()
  findAll(@Query() findPlanosDto: FindPlanosDto) {
    if (findPlanosDto.active === 'true') {
      return this.planosService.findActive(findPlanosDto);
    }
    return this.planosService.findAll(findPlanosDto);
  }

  @Get('statistics')
  getStatistics() {
    return this.planosService.getStatistics();
  }

  @Get('search/nome/:nome')
  findByNome(@Param('nome') nome: string) {
    return this.planosService.findByNome(nome);
  }

  @Get('search/price-range')
  findByPriceRange(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number,
  ) {
    return this.planosService.findByPriceRange(min, max);
  }

  @Get('search/features')
  findWithFeatures(
    @Query('whatsapp') whatsapp?: string,
    @Query('sms') sms?: string,
    @Query('email') email?: string,
    @Query('api') api?: string,
    @Query('cliente') cliente?: string,
    @Query('produto') produto?: string,
    @Query('botox') botox?: string,
    @Query('laudo') laudo?: string,
  ) {
    const features: any = {};

    if (whatsapp !== undefined) features.whatsapp = whatsapp === 'true';
    if (sms !== undefined) features.sms = sms === 'true';
    if (email !== undefined) features.email = email === 'true';
    if (api !== undefined) features.api = api === 'true';
    if (cliente !== undefined) features.cliente = cliente === 'true';
    if (produto !== undefined) features.produto = produto === 'true';
    if (botox !== undefined) features.botox = botox === 'true';
    if (laudo !== undefined) features.laudo = laudo === 'true';

    return this.planosService.findWithFeatures(features);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.findOne(id);
  }

  @Get(':id/price')
  calculatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Query('promo') promo?: string,
  ) {
    return this.planosService.findOne(id).then(plano => ({
      id: plano.id,
      nome: plano.nome,
      valor: plano.valor,
      valorPromo: plano.valorPromo,
      finalPrice: this.planosService.calculateFinalPrice(
        plano,
        promo === 'true',
      ),
      usingPromo: promo === 'true' && plano.valorPromo > 0,
    }));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanoDto: UpdatePlanoDto,
  ) {
    return this.planosService.update(id, updatePlanoDto);
  }

  @Patch(':id/toggle/:feature')
  toggleFeature(
    @Param('id', ParseIntPipe) id: number,
    @Param('feature') feature: string,
  ) {
    const validFeatures = [
      'integracaoWhatsapp',
      'integracaoSms',
      'integracaoEmail',
      'integracaoApi',
      'habilitaCliente',
      'habilitaProduto',
      'habilitaBotox',
      'habilitaLaudo',
    ];

    if (!validFeatures.includes(feature)) {
      throw new Error(`Feature inválida: ${feature}`);
    }

    return this.planosService.toggleFeature(id, feature as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.remove(id);
  }
}
