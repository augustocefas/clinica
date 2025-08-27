import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceiroService } from './financeiro.service';
import { FinanceiroController } from './financeiro.controller';
import { Financeiro } from './entities/financeiro.entity';
import { ItensFinanceiro } from './entities/itens-financeiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Financeiro, ItensFinanceiro])],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
