import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';
import { Tenancy } from './entities/tenancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy])],
  controllers: [TenancyController],
  providers: [TenancyService],
  exports: [TenancyService],
})
export class TenancyModule {}
