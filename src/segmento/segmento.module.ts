import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SegmentoService } from './segmento.service';
import { SegmentoController } from './segmento.controller';
import { Segmento } from './entities/segmento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segmento])],
  controllers: [SegmentoController],
  providers: [SegmentoService],
  exports: [SegmentoService, TypeOrmModule],
})
export class SegmentoModule {}
