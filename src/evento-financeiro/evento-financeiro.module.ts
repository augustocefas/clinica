import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoFinanceiroService } from './evento-financeiro.service';
import { EventoFinanceiroController } from './evento-financeiro.controller';
import { EventoFinanceiro } from './entities/evento-financeiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventoFinanceiro])],
  controllers: [EventoFinanceiroController],
  providers: [EventoFinanceiroService],
  exports: [EventoFinanceiroService],
})
export class EventoFinanceiroModule {}
