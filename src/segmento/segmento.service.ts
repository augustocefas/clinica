import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segmento } from './entities/segmento.entity';
import { CreateSegmentoDto } from './dto/create-segmento.dto';
import { UpdateSegmentoDto } from './dto/update-segmento.dto';

@Injectable()
export class SegmentoService {
  constructor(
    @InjectRepository(Segmento)
    private readonly segmentoRepository: Repository<Segmento>,
  ) {}

  async create(createSegmentoDto: CreateSegmentoDto): Promise<Segmento> {
    try {
      // Verificar se já existe um segmento com o mesmo nome
      const existingSegmento = await this.segmentoRepository.findOne({
        where: { nome: createSegmentoDto.nome },
      });

      if (existingSegmento) {
        throw new ConflictException('Já existe um segmento com este nome');
      }

      const segmento = this.segmentoRepository.create({
        ...createSegmentoDto,
        intervaloAlerta: createSegmentoDto.intervaloAlerta || 24,
      });

      return await this.segmentoRepository.save(segmento);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar segmento: ' + error.message);
    }
  }

  async findAll(): Promise<Segmento[]> {
    try {
      return await this.segmentoRepository.find({
        order: { nome: 'ASC' },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar segmentos: ' + error.message,
      );
    }
  }

  async findOne(id: number): Promise<Segmento> {
    try {
      const segmento = await this.segmentoRepository.findOne({
        where: { id },
      });

      if (!segmento) {
        throw new NotFoundException(`Segmento com ID ${id} não encontrado`);
      }

      return segmento;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao buscar segmento: ' + error.message,
      );
    }
  }

  async findByNome(nome: string): Promise<Segmento> {
    try {
      const segmento = await this.segmentoRepository.findOne({
        where: { nome },
      });

      if (!segmento) {
        throw new NotFoundException(
          `Segmento com nome "${nome}" não encontrado`,
        );
      }

      return segmento;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao buscar segmento por nome: ' + error.message,
      );
    }
  }

  async update(
    id: number,
    updateSegmentoDto: UpdateSegmentoDto,
  ): Promise<Segmento> {
    try {
      const segmento = await this.findOne(id);

      // Verificar se o novo nome já existe (se o nome está sendo alterado)
      if (updateSegmentoDto.nome && updateSegmentoDto.nome !== segmento.nome) {
        const existingSegmento = await this.segmentoRepository.findOne({
          where: { nome: updateSegmentoDto.nome },
        });

        if (existingSegmento) {
          throw new ConflictException('Já existe um segmento com este nome');
        }
      }

      Object.assign(segmento, updateSegmentoDto);
      return await this.segmentoRepository.save(segmento);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao atualizar segmento: ' + error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const segmento = await this.findOne(id);

      // Verificar se existem tenancies associadas
      const tenanciesCount = await this.segmentoRepository
        .createQueryBuilder('segmento')
        .leftJoin('tenancy', 'tenancy', 'tenancy.segmento_id = segmento.id')
        .where('segmento.id = :id', { id })
        .getCount();

      if (tenanciesCount > 0) {
        throw new ConflictException(
          'Não é possível excluir segmento que possui tenancies associadas',
        );
      }

      await this.segmentoRepository.remove(segmento);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao remover segmento: ' + error.message,
      );
    }
  }

  async getStatistics(): Promise<{
    total: number;
    intervaloMedio: number;
    porIntervalo: { intervalo: number; count: number }[];
  }> {
    try {
      const segmentos = await this.segmentoRepository.find();

      const total = segmentos.length;
      const intervaloMedio =
        total > 0
          ? segmentos.reduce((sum, seg) => sum + seg.intervaloAlerta, 0) / total
          : 0;

      // Estatísticas por intervalo
      const porIntervaloMap = new Map<number, number>();
      for (const segmento of segmentos) {
        const intervalo = segmento.intervaloAlerta;
        porIntervaloMap.set(
          intervalo,
          (porIntervaloMap.get(intervalo) || 0) + 1,
        );
      }

      const porIntervalo = Array.from(porIntervaloMap.entries())
        .map(([intervalo, count]) => ({ intervalo, count }))
        .sort((a, b) => a.intervalo - b.intervalo);

      return {
        total,
        intervaloMedio: Math.round(intervaloMedio * 100) / 100,
        porIntervalo,
      };
    } catch (error) {
      throw new BadRequestException(
        'Erro ao obter estatísticas: ' + error.message,
      );
    }
  }
}
