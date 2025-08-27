import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesService } from './exames.service';
import { ExamesController } from './exames.controller';
import { Exame } from './entities/exame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exame])],
  controllers: [ExamesController],
  providers: [ExamesService],
  exports: [ExamesService],
})
export class ExamesModule {}
