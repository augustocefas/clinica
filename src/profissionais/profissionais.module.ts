import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfissionaisService } from './profissionais.service';
import { ProfissionaisController } from './profissionais.controller';
import { Profissional } from './entities/profissional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profissional])],
  controllers: [ProfissionaisController],
  providers: [ProfissionaisService],
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
