import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusFinanceiroService } from './status-financeiro.service';
import { StatusFinanceiroController } from './status-financeiro.controller';
import { StatusFinanceiro } from './entities/status-financeiro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusFinanceiro])],
  controllers: [StatusFinanceiroController],
  providers: [StatusFinanceiroService],
  exports: [StatusFinanceiroService],
})
export class StatusFinanceiroModule {}
