import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetoresService } from './setores.service';
import { SetoresController } from './setores.controller';
import { Setor } from './entities/setor.entity';
import { SetorProfissionalTenancy } from './entities/setor-profissional-tenancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setor, SetorProfissionalTenancy])],
  controllers: [SetoresController],
  providers: [SetoresService],
  exports: [SetoresService],
})
export class SetoresModule {}
