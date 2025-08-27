import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusFinanceiro } from './entities/status-financeiro.entity';
import { CreateStatusFinanceiroDto } from './dto/create-status-financeiro.dto';
import { UpdateStatusFinanceiroDto } from './dto/update-status-financeiro.dto';

@Injectable()
export class StatusFinanceiroService {
  constructor(
    @InjectRepository(StatusFinanceiro)
    private statusFinanceiroRepository: Repository<StatusFinanceiro>,
  ) {}

  async create(
    createStatusFinanceiroDto: CreateStatusFinanceiroDto,
  ): Promise<StatusFinanceiro> {
    const statusFinanceiro = this.statusFinanceiroRepository.create(
      createStatusFinanceiroDto,
    );
    return await this.statusFinanceiroRepository.save(statusFinanceiro);
  }

  async findAll(): Promise<StatusFinanceiro[]> {
    return await this.statusFinanceiroRepository.find();
  }

  async findOne(id: number): Promise<StatusFinanceiro> {
    return await this.statusFinanceiroRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateStatusFinanceiroDto: UpdateStatusFinanceiroDto,
  ): Promise<StatusFinanceiro> {
    await this.statusFinanceiroRepository.update(id, updateStatusFinanceiroDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.statusFinanceiroRepository.delete(id);
  }
}
