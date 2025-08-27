import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { GrupoExame } from './entities/grupo-exame.entity';
import { CreateGrupoExameDto } from './dto/create-grupo-exame.dto';
import { UpdateGrupoExameDto } from './dto/update-grupo-exame.dto';

@Injectable()
export class GrupoExameService {
  constructor(
    @InjectRepository(GrupoExame)
    private readonly grupoExameRepository: Repository<GrupoExame>,
  ) {}

  async create(createGrupoExameDto: CreateGrupoExameDto): Promise<GrupoExame> {
    try {
      // Verificar se já existe um grupo de exame com o mesmo nome no mesmo setor
      const existingGrupoExame = await this.grupoExameRepository.findOne({
        where: {
          nome: createGrupoExameDto.nome,
          setorId: createGrupoExameDto.setorId,
          tenancyUuid: createGrupoExameDto.tenancyUuid,
        },
      });

      if (existingGrupoExame) {
        throw new ConflictException(
          'Já existe um grupo de exame com este nome neste setor',
        );
      }

      const grupoExame = this.grupoExameRepository.create({
        ...createGrupoExameDto,
        previsaoTempo: createGrupoExameDto.previsaoTempo || 'horas',
        valor: createGrupoExameDto.valor || 0,
      });

      return await this.grupoExameRepository.save(grupoExame);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao criar grupo de exame: ' + error.message,
      );
    }
  }

  async findAll(tenancyUuid?: string, setorId?: string): Promise<GrupoExame[]> {
    try {
      const options: FindManyOptions<GrupoExame> = {
        relations: ['tenancy', 'setor'],
        order: { nome: 'ASC' },
      };

      if (tenancyUuid || setorId) {
        options.where = {};
        if (tenancyUuid) {
          options.where.tenancyUuid = tenancyUuid;
        }
        if (setorId) {
          options.where.setorId = setorId;
        }
      }

      return await this.grupoExameRepository.find(options);
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar grupos de exame: ' + error.message,
      );
    }
  }

  async findOne(uuid: string): Promise<GrupoExame> {
    try {
      const grupoExame = await this.grupoExameRepository.findOne({
        where: { uuid },
        relations: ['tenancy', 'setor'],
      });

      if (!grupoExame) {
        throw new NotFoundException(
          `Grupo de exame com UUID ${uuid} não encontrado`,
        );
      }

      return grupoExame;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao buscar grupo de exame: ' + error.message,
      );
    }
  }

  async findBySetor(
    setorId: string,
    tenancyUuid: string,
  ): Promise<GrupoExame[]> {
    try {
      return await this.grupoExameRepository.find({
        where: {
          setorId,
          tenancyUuid,
        },
        relations: ['setor'],
        order: { nome: 'ASC' },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar grupos de exame por setor: ' + error.message,
      );
    }
  }

  async update(
    uuid: string,
    updateGrupoExameDto: UpdateGrupoExameDto,
  ): Promise<GrupoExame> {
    try {
      const grupoExame = await this.findOne(uuid);

      // Verificar se o novo nome já existe (se o nome está sendo alterado)
      if (
        updateGrupoExameDto.nome &&
        updateGrupoExameDto.nome !== grupoExame.nome
      ) {
        const existingGrupoExame = await this.grupoExameRepository.findOne({
          where: {
            nome: updateGrupoExameDto.nome,
            setorId: updateGrupoExameDto.setorId || grupoExame.setorId,
            tenancyUuid:
              updateGrupoExameDto.tenancyUuid || grupoExame.tenancyUuid,
          },
        });

        if (existingGrupoExame) {
          throw new ConflictException(
            'Já existe um grupo de exame com este nome neste setor',
          );
        }
      }

      Object.assign(grupoExame, updateGrupoExameDto);
      return await this.grupoExameRepository.save(grupoExame);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao atualizar grupo de exame: ' + error.message,
      );
    }
  }

  async remove(uuid: string): Promise<void> {
    try {
      await this.findOne(uuid); // Verifica se existe
      await this.grupoExameRepository.softDelete(uuid);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao remover grupo de exame: ' + error.message,
      );
    }
  }

  async restore(uuid: string): Promise<GrupoExame> {
    try {
      await this.grupoExameRepository.restore(uuid);
      return await this.findOne(uuid);
    } catch (error) {
      throw new BadRequestException(
        'Erro ao restaurar grupo de exame: ' + error.message,
      );
    }
  }

  async getStatistics(tenancyUuid?: string): Promise<{
    total: number;
    porSetor: { setorNome: string; count: number }[];
    valorMedio: number;
  }> {
    try {
      const queryBuilder = this.grupoExameRepository
        .createQueryBuilder('grupoExame')
        .leftJoin('grupoExame.setor', 'setor');

      if (tenancyUuid) {
        queryBuilder.where('grupoExame.tenancyUuid = :tenancyUuid', {
          tenancyUuid,
        });
      }

      const gruposExame = await queryBuilder.getMany();

      const total = gruposExame.length;
      const valorMedio =
        total > 0
          ? gruposExame.reduce((sum, grupo) => sum + Number(grupo.valor), 0) /
            total
          : 0;

      // Estatísticas por setor
      const porSetorMap = new Map<string, number>();
      for (const grupo of gruposExame) {
        const setorNome = grupo.setor?.nome || 'Setor não definido';
        porSetorMap.set(setorNome, (porSetorMap.get(setorNome) || 0) + 1);
      }

      const porSetor = Array.from(porSetorMap.entries()).map(
        ([setorNome, count]) => ({
          setorNome,
          count,
        }),
      );

      return {
        total,
        porSetor,
        valorMedio,
      };
    } catch (error) {
      throw new BadRequestException(
        'Erro ao obter estatísticas: ' + error.message,
      );
    }
  }
}
