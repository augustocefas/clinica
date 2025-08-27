import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procedimento } from './entities/procedimento.entity';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';

@Injectable()
export class ProcedimentosService {
  constructor(
    @InjectRepository(Procedimento)
    private readonly procedimentoRepository: Repository<Procedimento>,
  ) {}

  async create(
    createProcedimentoDto: CreateProcedimentoDto,
  ): Promise<Procedimento> {
    try {
      // Verificar se já existe um procedimento com o mesmo nome no tenancy
      const existingProcedimento = await this.procedimentoRepository.findOne({
        where: {
          nome: createProcedimentoDto.nome,
          tenancyUuid: createProcedimentoDto.tenancyUuid,
        },
      });

      if (existingProcedimento) {
        throw new ConflictException(
          'Já existe um procedimento com este nome neste tenancy',
        );
      }

      const procedimento = this.procedimentoRepository.create(
        createProcedimentoDto,
      );
      return await this.procedimentoRepository.save(procedimento);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao criar procedimento: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Procedimento[]> {
    try {
      return await this.procedimentoRepository.find({
        relations: ['tenancy'],
        order: { nome: 'ASC' },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar procedimentos: ' + error.message,
      );
    }
  }

  async findByTenancy(tenancyUuid: string): Promise<Procedimento[]> {
    try {
      return await this.procedimentoRepository.find({
        where: { tenancyUuid },
        relations: ['tenancy'],
        order: { nome: 'ASC' },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar procedimentos por tenancy: ' + error.message,
      );
    }
  }

  async findOne(uuid: string): Promise<Procedimento> {
    try {
      const procedimento = await this.procedimentoRepository.findOne({
        where: { uuid },
        relations: ['tenancy'],
      });

      if (!procedimento) {
        throw new NotFoundException(
          `Procedimento com UUID ${uuid} não encontrado`,
        );
      }

      return procedimento;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao buscar procedimento: ' + error.message,
      );
    }
  }

  async findByNome(
    nome: string,
    tenancyUuid?: string,
  ): Promise<Procedimento[]> {
    try {
      const queryBuilder = this.procedimentoRepository
        .createQueryBuilder('procedimento')
        .leftJoinAndSelect('procedimento.tenancy', 'tenancy')
        .where('procedimento.nome ILIKE :nome', { nome: `%${nome}%` });

      if (tenancyUuid) {
        queryBuilder.andWhere('procedimento.tenancyUuid = :tenancyUuid', {
          tenancyUuid,
        });
      }

      const procedimentos = await queryBuilder
        .orderBy('procedimento.nome', 'ASC')
        .getMany();

      if (procedimentos.length === 0) {
        throw new NotFoundException(
          `Nenhum procedimento encontrado com nome contendo "${nome}"`,
        );
      }

      return procedimentos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao buscar procedimento por nome: ' + error.message,
      );
    }
  }

  async update(
    uuid: string,
    updateProcedimentoDto: UpdateProcedimentoDto,
  ): Promise<Procedimento> {
    try {
      const procedimento = await this.findOne(uuid);

      // Verificar se o novo nome já existe no tenancy (se o nome está sendo alterado)
      if (
        updateProcedimentoDto.nome &&
        updateProcedimentoDto.nome !== procedimento.nome
      ) {
        const existingProcedimento = await this.procedimentoRepository.findOne({
          where: {
            nome: updateProcedimentoDto.nome,
            tenancyUuid: procedimento.tenancyUuid,
          },
        });

        if (existingProcedimento) {
          throw new ConflictException(
            'Já existe um procedimento com este nome neste tenancy',
          );
        }
      }

      Object.assign(procedimento, updateProcedimentoDto);
      return await this.procedimentoRepository.save(procedimento);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao atualizar procedimento: ' + error.message,
      );
    }
  }

  async remove(uuid: string): Promise<void> {
    try {
      const procedimento = await this.findOne(uuid);

      // Verificar se existem agendas associadas via agenda_procedimento_tenancy
      const agendasCount = await this.procedimentoRepository
        .createQueryBuilder('procedimento')
        .leftJoin(
          'agenda_procedimento_tenancy',
          'apt',
          'apt.procedimento_uuid = procedimento.uuid',
        )
        .where('procedimento.uuid = :uuid', { uuid })
        .getCount();

      if (agendasCount > 0) {
        throw new ConflictException(
          'Não é possível excluir procedimento que possui agendas associadas',
        );
      }

      await this.procedimentoRepository.remove(procedimento);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao remover procedimento: ' + error.message,
      );
    }
  }

  async getStatistics(tenancyUuid?: string): Promise<{
    total: number;
    valorMedio: number;
    tempoMedioMinutos: number;
    porTenancy: { tenancySlug: string; count: number }[];
    valoresTotais: {
      totalValor: number;
      maiorValor: number;
      menorValor: number;
    };
  }> {
    try {
      const queryBuilder = this.procedimentoRepository
        .createQueryBuilder('procedimento')
        .leftJoinAndSelect('procedimento.tenancy', 'tenancy');

      if (tenancyUuid) {
        queryBuilder.where('procedimento.tenancyUuid = :tenancyUuid', {
          tenancyUuid,
        });
      }

      const procedimentos = await queryBuilder.getMany();

      const total = procedimentos.length;

      // Cálculo de valores
      const valores = procedimentos.map(p => Number(p.valor));
      const valorMedio =
        total > 0 ? valores.reduce((sum, val) => sum + val, 0) / total : 0;
      const maiorValor = total > 0 ? Math.max(...valores) : 0;
      const menorValor = total > 0 ? Math.min(...valores) : 0;
      const totalValor = valores.reduce((sum, val) => sum + val, 0);

      // Cálculo de tempo médio
      const tempos = procedimentos
        .filter(p => p.tempoMedioMinutos)
        .map(p => Number(p.tempoMedioMinutos));
      const tempoMedioMinutos =
        tempos.length > 0
          ? tempos.reduce((sum, val) => sum + val, 0) / tempos.length
          : 0;

      // Estatísticas por tenancy
      const porTenancyMap = new Map<string, number>();
      for (const procedimento of procedimentos) {
        const tenancySlug = procedimento.tenancy?.slug || 'Sem tenancy';
        porTenancyMap.set(
          tenancySlug,
          (porTenancyMap.get(tenancySlug) || 0) + 1,
        );
      }

      const porTenancy = Array.from(porTenancyMap.entries())
        .map(([tenancySlug, count]) => ({ tenancySlug, count }))
        .sort((a, b) => b.count - a.count);

      return {
        total,
        valorMedio: Math.round(valorMedio * 100) / 100,
        tempoMedioMinutos: Math.round(tempoMedioMinutos * 100) / 100,
        porTenancy,
        valoresTotais: {
          totalValor: Math.round(totalValor * 100) / 100,
          maiorValor: Math.round(maiorValor * 100) / 100,
          menorValor: Math.round(menorValor * 100) / 100,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Erro ao obter estatísticas: ' + error.message,
      );
    }
  }
}
