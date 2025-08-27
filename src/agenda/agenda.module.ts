import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { Agenda } from './entities/agenda.entity';
import { AgendaProcedimentoTenancy } from './entities/agenda-procedimento-tenancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda, AgendaProcedimentoTenancy])],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService, TypeOrmModule],
})
export class AgendaModule {}
