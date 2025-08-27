import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { AddProfissionalToSetorDto } from './dto/add-profissional-to-setor.dto';
import { RemoveProfissionalFromSetorDto } from './dto/remove-profissional-from-setor.dto';
import { FilterSetoresDto } from './dto/filter-setores.dto';
import { Setor } from './entities/setor.entity';
import { SetorProfissionalTenancy } from './entities/setor-profissional-tenancy.entity';
import {
  ISetorFilterResponse,
  ISetorStats,
} from './interfaces/setor.interface';

@Injectable()
export class SetoresService {
  constructor(
    @InjectRepository(Setor)
    private setorRepository: Repository<Setor>,
    @InjectRepository(SetorProfissionalTenancy)
    private setorProfissionalRepository: Repository<SetorProfissionalTenancy>,
  ) {}

  async create(createSetorDto: CreateSetorDto) {
    // Verificar se já existe um setor com o mesmo nome no tenancy
    const existingSetor = await this.setorRepository.findOne({
      where: {
        tenancyUuid: createSetorDto.tenancyUuid,
        nome: createSetorDto.nome,
      },
    });

    if (existingSetor) {
      throw new ConflictException(
        `Já existe um setor com o nome "${createSetorDto.nome}" neste tenancy`,
      );
    }

    const setor = this.setorRepository.create(createSetorDto);
    return this.setorRepository.save(setor);
  }

  findAll() {
    return this.setorRepository.find({
      relations: ['tenancy'],
    });
  }

  async findOne(uuid: string) {
    const setor = await this.setorRepository.findOne({
      where: { uuid },
      relations: ['tenancy'],
    });

    if (!setor) {
      throw new NotFoundException(`Setor com UUID ${uuid} não encontrado`);
    }

    return setor;
  }

  findByTenancy(tenancyUuid: string) {
    return this.setorRepository.find({
      where: { tenancyUuid },
      relations: ['tenancy'],
      order: { nome: 'ASC' },
    });
  }

  findActiveByTenancy(tenancyUuid: string) {
    return this.setorRepository.find({
      where: { tenancyUuid, ativo: true },
      relations: ['tenancy'],
      order: { nome: 'ASC' },
    });
  }

  findByNome(tenancyUuid: string, nome: string) {
    return this.setorRepository.findOne({
      where: { tenancyUuid, nome },
      relations: ['tenancy'],
    });
  }

  async update(uuid: string, updateSetorDto: UpdateSetorDto) {
    const setor = await this.findOne(uuid);

    // Se está atualizando o nome, verificar se não existe outro setor com o mesmo nome no tenancy
    if (updateSetorDto.nome && updateSetorDto.nome !== setor.nome) {
      const existingSetor = await this.setorRepository.findOne({
        where: {
          tenancyUuid: setor.tenancyUuid,
          nome: updateSetorDto.nome,
        },
      });

      if (existingSetor && existingSetor.uuid !== uuid) {
        throw new ConflictException(
          `Já existe um setor com o nome "${updateSetorDto.nome}" neste tenancy`,
        );
      }
    }

    await this.setorRepository.update(uuid, updateSetorDto);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    await this.findOne(uuid); // Verifica se existe
    return this.setorRepository.delete(uuid);
  }

  async toggleAtivo(uuid: string) {
    const setor = await this.findOne(uuid);
    setor.ativo = !setor.ativo;
    return this.setorRepository.save(setor);
  }

  // Métodos para gerenciar relacionamento setor-profissional
  async addProfissionalToSetor(
    setorUuid: string,
    addProfissionalDto: AddProfissionalToSetorDto,
  ) {
    // Verificar se o setor existe
    await this.findOne(setorUuid);

    // Verificar se o relacionamento já existe
    const existingRelation = await this.setorProfissionalRepository.findOne({
      where: {
        setorUuid,
        profissionalUuid: addProfissionalDto.profissionalUuid,
        tenancyUuid: addProfissionalDto.tenancyUuid,
      },
    });

    if (existingRelation) {
      throw new ConflictException(
        'Profissional já está associado a este setor neste tenancy',
      );
    }

    const setorProfissional = this.setorProfissionalRepository.create({
      setorUuid,
      profissionalUuid: addProfissionalDto.profissionalUuid,
      tenancyUuid: addProfissionalDto.tenancyUuid,
    });

    return this.setorProfissionalRepository.save(setorProfissional);
  }

  async removeProfissionalFromSetor(
    setorUuid: string,
    removeProfissionalDto: RemoveProfissionalFromSetorDto,
  ) {
    const relation = await this.setorProfissionalRepository.findOne({
      where: {
        setorUuid,
        profissionalUuid: removeProfissionalDto.profissionalUuid,
        tenancyUuid: removeProfissionalDto.tenancyUuid,
      },
    });

    if (!relation) {
      throw new NotFoundException(
        'Relacionamento entre setor e profissional não encontrado',
      );
    }

    return this.setorProfissionalRepository.remove(relation);
  }

  async getProfissionaisBySetor(setorUuid: string, tenancyUuid: string) {
    return this.setorProfissionalRepository.find({
      where: { setorUuid, tenancyUuid },
      relations: ['profissional', 'setor', 'tenancy'],
    });
  }

  async getSetoresByProfissional(
    profissionalUuid: string,
    tenancyUuid: string,
  ) {
    return this.setorProfissionalRepository.find({
      where: { profissionalUuid, tenancyUuid },
      relations: ['profissional', 'setor', 'tenancy'],
    });
  }

  // Método para buscar setores com seus relacionamentos completos
  async findOneWithRelations(uuid: string) {
    const setor = await this.setorRepository.findOne({
      where: { uuid },
      relations: [
        'tenancy',
        'setorProfissionais',
        'setorProfissionais.profissional',
      ],
    });

    if (!setor) {
      throw new NotFoundException(`Setor com UUID ${uuid} não encontrado`);
    }

    return setor;
  }

  async findByTenancyWithRelations(tenancyUuid: string) {
    return this.setorRepository.find({
      where: { tenancyUuid },
      relations: [
        'tenancy',
        'setorProfissionais',
        'setorProfissionais.profissional',
      ],
      order: { nome: 'ASC' },
    });
  }

  // Método avançado para buscar setores com filtros
  async findWithFilters(
    filterDto: FilterSetoresDto,
  ): Promise<ISetorFilterResponse> {
    const {
      nome,
      ativo,
      tenancyUuid,
      search,
      limit,
      offset,
      orderBy,
      orderDirection,
    } = filterDto;

    const where: FindOptionsWhere<Setor> = {};

    if (tenancyUuid) {
      where.tenancyUuid = tenancyUuid;
    }

    if (nome) {
      where.nome = Like(`%${nome}%`);
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (search) {
      where.nome = Like(`%${search}%`);
    }

    const queryBuilder = this.setorRepository
      .createQueryBuilder('setor')
      .leftJoinAndSelect('setor.tenancy', 'tenancy')
      .leftJoinAndSelect('setor.setorProfissionais', 'setorProfissionais')
      .leftJoinAndSelect('setorProfissionais.profissional', 'profissional');

    if (where.tenancyUuid) {
      queryBuilder.andWhere('setor.tenancyUuid = :tenancyUuid', {
        tenancyUuid: where.tenancyUuid,
      });
    }

    if (where.nome) {
      queryBuilder.andWhere('setor.nome ILIKE :nome', {
        nome: `%${nome || search}%`,
      });
    }

    if (where.ativo !== undefined) {
      queryBuilder.andWhere('setor.ativo = :ativo', { ativo: where.ativo });
    }

    queryBuilder
      .orderBy(`setor.${orderBy}`, orderDirection)
      .take(limit)
      .skip(offset);

    const [setores, total] = await queryBuilder.getManyAndCount();

    return {
      data: setores as any, // Usando any temporariamente para resolver o conflito de tipos
      total,
      limit,
      offset,
    };
  }

  // Método para obter estatísticas dos setores
  async getSetorStats(tenancyUuid: string): Promise<ISetorStats> {
    const totalSetores = await this.setorRepository.count({
      where: { tenancyUuid },
    });

    const setoresAtivos = await this.setorRepository.count({
      where: { tenancyUuid, ativo: true },
    });

    const setoresInativos = totalSetores - setoresAtivos;

    const totalProfissionaisAssociados =
      await this.setorProfissionalRepository.count({
        where: { tenancyUuid },
      });

    return {
      totalSetores,
      setoresAtivos,
      setoresInativos,
      totalProfissionaisAssociados,
    };
  }
}
