import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcedimentosService } from './procedimentos.service';
import { ProcedimentosController } from './procedimentos.controller';
import { Procedimento } from './entities/procedimento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Procedimento])],
  controllers: [ProcedimentosController],
  providers: [ProcedimentosService],
  exports: [ProcedimentosService, TypeOrmModule],
})
export class ProcedimentosModule {}
