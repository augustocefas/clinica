import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoExameService } from './grupo-exame.service';
import { GrupoExameController } from './grupo-exame.controller';
import { GrupoExame } from './entities/grupo-exame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoExame])],
  controllers: [GrupoExameController],
  providers: [GrupoExameService],
  exports: [GrupoExameService, TypeOrmModule],
})
export class GrupoExameModule {}
