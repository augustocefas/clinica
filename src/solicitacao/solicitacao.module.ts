import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitacaoService } from './solicitacao.service';
import { SolicitacaoController } from './solicitacao.controller';
import { Solicitacao } from './entities/solicitacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitacao])],
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService],
  exports: [SolicitacaoService, TypeOrmModule],
})
export class SolicitacaoModule {}
