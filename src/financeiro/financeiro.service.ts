import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Financeiro } from './entities/financeiro.entity';
import { CreateFinanceiroDto } from './dto/create-financeiro.dto';
import { UpdateFinanceiroDto } from './dto/update-financeiro.dto';

@Injectable()
export class FinanceiroService {
  constructor(
    @InjectRepository(Financeiro)
    private readonly financeiroRepository: Repository<Financeiro>,
  ) {}

  async create(createFinanceiroDto: CreateFinanceiroDto): Promise<Financeiro> {
    const financeiro = this.financeiroRepository.create({
      ...createFinanceiroDto,
      dataVencimento: createFinanceiroDto.dataVencimento
        ? new Date(createFinanceiroDto.dataVencimento)
        : null,
      dataPagamento: createFinanceiroDto.dataPagamento
        ? new Date(createFinanceiroDto.dataPagamento)
        : null,
    });
    return await this.financeiroRepository.save(financeiro);
  }

  async findAll(): Promise<Financeiro[]> {
    return await this.financeiroRepository.find({
      relations: ['tenancy', 'statusFinanceiro'],
    });
  }

  async findOne(uuid: string): Promise<Financeiro> {
    return await this.financeiroRepository.findOne({
      where: { uuid },
      relations: [
        'tenancy',
        'statusFinanceiro',
        'eventosFinanceiros',
        'itensFinanceiros',
      ],
    });
  }

  async update(
    uuid: string,
    updateFinanceiroDto: UpdateFinanceiroDto,
  ): Promise<Financeiro> {
    const updateData = {
      ...updateFinanceiroDto,
      dataVencimento: updateFinanceiroDto.dataVencimento
        ? new Date(updateFinanceiroDto.dataVencimento)
        : undefined,
      dataPagamento: updateFinanceiroDto.dataPagamento
        ? new Date(updateFinanceiroDto.dataPagamento)
        : undefined,
    };

    await this.financeiroRepository.update(uuid, updateData);
    return await this.findOne(uuid);
  }

  async remove(uuid: string): Promise<void> {
    await this.financeiroRepository.delete(uuid);
  }

  async findByTenancy(tenancyUuid: string): Promise<Financeiro[]> {
    return await this.financeiroRepository.find({
      where: { tenancyUuid },
      relations: ['statusFinanceiro'],
    });
  }
}
