import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoFinanceiro } from './entities/evento-financeiro.entity';
import { CreateEventoFinanceiroDto } from './dto/create-evento-financeiro.dto';
import { UpdateEventoFinanceiroDto } from './dto/update-evento-financeiro.dto';

@Injectable()
export class EventoFinanceiroService {
  constructor(
    @InjectRepository(EventoFinanceiro)
    private readonly eventoFinanceiroRepository: Repository<EventoFinanceiro>,
  ) {}

  async create(
    createEventoFinanceiroDto: CreateEventoFinanceiroDto,
  ): Promise<EventoFinanceiro> {
    const eventoFinanceiro = this.eventoFinanceiroRepository.create({
      ...createEventoFinanceiroDto,
      novaData: createEventoFinanceiroDto.novaData
        ? new Date(createEventoFinanceiroDto.novaData)
        : null,
    });
    return await this.eventoFinanceiroRepository.save(eventoFinanceiro);
  }

  async findAll(): Promise<EventoFinanceiro[]> {
    return await this.eventoFinanceiroRepository.find({
      relations: ['statusFinanceiro', 'financeiro'],
    });
  }

  async findOne(uuid: string): Promise<EventoFinanceiro> {
    return await this.eventoFinanceiroRepository.findOne({
      where: { uuid },
      relations: ['statusFinanceiro', 'financeiro'],
    });
  }

  async update(
    uuid: string,
    updateEventoFinanceiroDto: UpdateEventoFinanceiroDto,
  ): Promise<EventoFinanceiro> {
    const updateData = {
      ...updateEventoFinanceiroDto,
      novaData: updateEventoFinanceiroDto.novaData
        ? new Date(updateEventoFinanceiroDto.novaData)
        : undefined,
    };

    await this.eventoFinanceiroRepository.update(uuid, updateData);
    return await this.findOne(uuid);
  }

  async remove(uuid: string): Promise<void> {
    await this.eventoFinanceiroRepository.delete(uuid);
  }

  async findByFinanceiro(financeiroUuid: string): Promise<EventoFinanceiro[]> {
    return await this.eventoFinanceiroRepository.find({
      where: { financeiroUuid },
      relations: ['statusFinanceiro'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEvento(evento: string): Promise<EventoFinanceiro[]> {
    return await this.eventoFinanceiroRepository.find({
      where: { evento },
      relations: ['statusFinanceiro', 'financeiro'],
      order: { createdAt: 'DESC' },
    });
  }
}
