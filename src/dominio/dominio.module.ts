import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DominioService } from './dominio.service';
import { DominioController } from './dominio.controller';
import { Dominio } from './entities/dominio.entity';
import { TipoDominio } from './entities/tipo-dominio.entity';
import { DominioConfig } from './entities/dominio-config.entity';
import { TipoDominioConfig } from './entities/tipo-dominio-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dominio,
      TipoDominio,
      DominioConfig,
      TipoDominioConfig,
    ]),
  ],
  controllers: [DominioController],
  providers: [DominioService],
  exports: [DominioService, TypeOrmModule],
})
export class DominioModule {}
