import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { Plano } from './entities/plano.entity';

@Injectable()
export class PlanosService {
  constructor(
    @InjectRepository(Plano)
    private planoRepository: Repository<Plano>,
  ) {}

  async create(createPlanoDto: CreatePlanoDto) {
    // Verificar se já existe um plano com o mesmo nome
    const existingPlano = await this.planoRepository.findOne({
      where: { nome: createPlanoDto.nome },
    });

    if (existingPlano) {
      throw new ConflictException(
        `Já existe um plano com o nome "${createPlanoDto.nome}"`,
      );
    }

    const plano = this.planoRepository.create(createPlanoDto);
    return this.planoRepository.save(plano);
  }

  findAll() {
    return this.planoRepository.find({
      order: { nome: 'ASC' },
    });
  }

  findActive() {
    return this.planoRepository.find({
      where: { valor: { $gt: 0 } as any }, // Planos com valor > 0 considerados ativos
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number) {
    const plano = await this.planoRepository.findOne({
      where: { id },
    });

    if (!plano) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }

    return plano;
  }

  findByNome(nome: string) {
    return this.planoRepository.findOne({
      where: { nome },
    });
  }

  findByPriceRange(minValue: number, maxValue: number) {
    return this.planoRepository
      .createQueryBuilder('plano')
      .where('plano.valor BETWEEN :minValue AND :maxValue', {
        minValue,
        maxValue,
      })
      .orderBy('plano.valor', 'ASC')
      .getMany();
  }

  findWithFeatures(features: {
    whatsapp?: boolean;
    sms?: boolean;
    email?: boolean;
    api?: boolean;
    cliente?: boolean;
    produto?: boolean;
    botox?: boolean;
    laudo?: boolean;
  }) {
    const query = this.planoRepository.createQueryBuilder('plano');

    if (features.whatsapp !== undefined) {
      query.andWhere('plano.integracaoWhatsapp = :whatsapp', {
        whatsapp: features.whatsapp,
      });
    }
    if (features.sms !== undefined) {
      query.andWhere('plano.integracaoSms = :sms', { sms: features.sms });
    }
    if (features.email !== undefined) {
      query.andWhere('plano.integracaoEmail = :email', {
        email: features.email,
      });
    }
    if (features.api !== undefined) {
      query.andWhere('plano.integracaoApi = :api', { api: features.api });
    }
    if (features.cliente !== undefined) {
      query.andWhere('plano.habilitaCliente = :cliente', {
        cliente: features.cliente,
      });
    }
    if (features.produto !== undefined) {
      query.andWhere('plano.habilitaProduto = :produto', {
        produto: features.produto,
      });
    }
    if (features.botox !== undefined) {
      query.andWhere('plano.habilitaBotox = :botox', {
        botox: features.botox,
      });
    }
    if (features.laudo !== undefined) {
      query.andWhere('plano.habilitaLaudo = :laudo', {
        laudo: features.laudo,
      });
    }

    return query.orderBy('plano.valor', 'ASC').getMany();
  }

  async update(id: number, updatePlanoDto: UpdatePlanoDto) {
    const plano = await this.findOne(id);

    // Se está atualizando o nome, verificar se não existe outro plano com o mesmo nome
    if (updatePlanoDto.nome && updatePlanoDto.nome !== plano.nome) {
      const existingPlano = await this.planoRepository.findOne({
        where: { nome: updatePlanoDto.nome },
      });

      if (existingPlano && existingPlano.id !== id) {
        throw new ConflictException(
          `Já existe um plano com o nome "${updatePlanoDto.nome}"`,
        );
      }
    }

    await this.planoRepository.update(id, updatePlanoDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar se existe

    // Verificar se o plano está sendo usado por algum tenancy
    // TODO: Adicionar verificação quando o relacionamento com Tenancy estiver implementado

    return this.planoRepository.delete(id);
  }

  async toggleFeature(
    id: number,
    feature:
      | 'integracaoWhatsapp'
      | 'integracaoSms'
      | 'integracaoEmail'
      | 'integracaoApi'
      | 'habilitaCliente'
      | 'habilitaProduto'
      | 'habilitaBotox'
      | 'habilitaLaudo',
  ) {
    const plano = await this.findOne(id);
    plano[feature] = !plano[feature];
    return this.planoRepository.save(plano);
  }

  // Método para calcular preço com desconto promocional
  calculateFinalPrice(plano: Plano, usePromo: boolean = false): number {
    return usePromo && plano.valorPromo > 0 ? plano.valorPromo : plano.valor;
  }

  // Método para obter estatísticas dos planos
  async getStatistics() {
    const [total, withWhatsapp, withSms, withEmail, avgPrice] =
      await Promise.all([
        this.planoRepository.count(),
        this.planoRepository.count({ where: { integracaoWhatsapp: true } }),
        this.planoRepository.count({ where: { integracaoSms: true } }),
        this.planoRepository.count({ where: { integracaoEmail: true } }),
        this.planoRepository
          .createQueryBuilder('plano')
          .select('AVG(plano.valor)', 'avg')
          .getRawOne(),
      ]);

    return {
      total,
      withWhatsapp,
      withSms,
      withEmail,
      averagePrice: parseFloat(avgPrice.avg) || 0,
    };
  }
}
