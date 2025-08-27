import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { Solicitacao } from './entities/solicitacao.entity';

@Injectable()
export class SolicitacaoService {
  constructor(
    @InjectRepository(Solicitacao)
    private readonly solicitacaoRepository: Repository<Solicitacao>,
  ) {}

  async create(
    createSolicitacaoDto: CreateSolicitacaoDto,
  ): Promise<Solicitacao> {
    // Verificar se já existe uma solicitação com a mesma agenda e descrição
    const existingSolicitacao = await this.solicitacaoRepository.findOne({
      where: {
        agendaUuid: createSolicitacaoDto.agendaUuid,
        descricao: createSolicitacaoDto.descricao,
      },
    });

    if (existingSolicitacao) {
      throw new ConflictException(
        'Já existe uma solicitação com esta descrição para esta agenda',
      );
    }

    const solicitacao = this.solicitacaoRepository.create(createSolicitacaoDto);
    return await this.solicitacaoRepository.save(solicitacao);
  }

  async findAll(): Promise<Solicitacao[]> {
    return await this.solicitacaoRepository.find({
      relations: ['agenda'],
    });
  }

  async findByAgenda(agendaUuid: string): Promise<Solicitacao[]> {
    return await this.solicitacaoRepository.find({
      where: { agendaUuid },
      relations: ['agenda'],
    });
  }

  async findOne(agendaUuid: string, descricao: string): Promise<Solicitacao> {
    const solicitacao = await this.solicitacaoRepository.findOne({
      where: { agendaUuid, descricao },
      relations: ['agenda'],
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return solicitacao;
  }

  async update(
    agendaUuid: string,
    descricao: string,
    updateSolicitacaoDto: UpdateSolicitacaoDto,
  ): Promise<Solicitacao> {
    const solicitacao = await this.findOne(agendaUuid, descricao);

    // Se está mudando a descrição, verificar se não vai gerar conflito
    if (
      updateSolicitacaoDto.descricao &&
      updateSolicitacaoDto.descricao !== descricao
    ) {
      const existingSolicitacao = await this.solicitacaoRepository.findOne({
        where: {
          agendaUuid: updateSolicitacaoDto.agendaUuid || agendaUuid,
          descricao: updateSolicitacaoDto.descricao,
        },
      });

      if (existingSolicitacao) {
        throw new ConflictException(
          'Já existe uma solicitação com esta descrição para esta agenda',
        );
      }
    }

    // Como é uma chave composta, precisamos remover e criar novamente se houver mudança
    if (updateSolicitacaoDto.agendaUuid || updateSolicitacaoDto.descricao) {
      await this.solicitacaoRepository.remove(solicitacao);

      const newSolicitacao = this.solicitacaoRepository.create({
        agendaUuid: updateSolicitacaoDto.agendaUuid || agendaUuid,
        descricao: updateSolicitacaoDto.descricao || descricao,
      });

      return await this.solicitacaoRepository.save(newSolicitacao);
    }

    return solicitacao;
  }

  async remove(agendaUuid: string, descricao: string): Promise<void> {
    const solicitacao = await this.findOne(agendaUuid, descricao);
    await this.solicitacaoRepository.remove(solicitacao);
  }

  async removeByAgenda(agendaUuid: string): Promise<void> {
    await this.solicitacaoRepository.delete({ agendaUuid });
  }
}
