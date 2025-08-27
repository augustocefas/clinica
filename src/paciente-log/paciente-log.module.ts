import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteLogService } from './paciente-log.service';
import { PacienteLogController } from './paciente-log.controller';
import { PacienteLog } from './entities/paciente-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteLog])],
  controllers: [PacienteLogController],
  providers: [PacienteLogService],
  exports: [PacienteLogService, TypeOrmModule],
})
export class PacienteLogModule {}
