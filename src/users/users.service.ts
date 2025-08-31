import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tenancy)
    private readonly tenancyRepository: Repository<Tenancy>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Usuário com email "${createUserDto.email}" já existe`,
      );
    }

    // Hash da senha
    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    );

    // Buscar tenancies se fornecidas
    let tenancies: Tenancy[] = [];
    if (createUserDto.tenancyUuids && createUserDto.tenancyUuids.length > 0) {
      tenancies = await this.tenancyRepository.find({
        where: { uuid: In(createUserDto.tenancyUuids) },
      });

      if (tenancies.length !== createUserDto.tenancyUuids.length) {
        throw new BadRequestException(
          'Uma ou mais tenancies fornecidas não existem',
        );
      }
    }

    // Criar usuário
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      tenancies,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      relations: ['tenancies'],
      order: { name: 'ASC' },
      select: {
        uuid: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        tenancies: {
          uuid: true,
          slug: true,
          segmentoId: true,
        },
      },
    });
  }

  async findOne(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['tenancies'],
      select: {
        uuid: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        tenancies: {
          uuid: true,
          slug: true,
          segmentoId: true,
          prepago: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com UUID ${uuid} não encontrado`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tenancies'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return user;
  }

  async findByTenancy(tenancyUuid: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.tenancies', 'tenancy')
      .where('tenancy.uuid = :tenancyUuid', { tenancyUuid })
      .select([
        'user.uuid',
        'user.name',
        'user.email',
        'user.emailVerifiedAt',
        'user.createdAt',
        'user.updatedAt',
      ])
      .getMany();
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(uuid);

    // Verificar se o email já existe (se está sendo alterado)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.uuid !== uuid) {
        throw new ConflictException(
          `Usuário com email "${updateUserDto.email}" já existe`,
        );
      }
    }

    // Atualizar tenancies se fornecidas
    if (updateUserDto.tenancyUuids) {
      const tenancies = await this.tenancyRepository.find({
        where: { uuid: In(updateUserDto.tenancyUuids) },
      });

      if (tenancies.length !== updateUserDto.tenancyUuids.length) {
        throw new BadRequestException(
          'Uma ou mais tenancies fornecidas não existem',
        );
      }

      user.tenancies = tenancies;
      await this.userRepository.save(user);
    }

    // Atualizar outros campos
    await this.userRepository.update(uuid, {
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    return this.findOne(uuid);
  }

  async uploadPhoto(uuid: string, photo: Express.Multer.File) {
    const user = await this.findOne(uuid);

    if (!user) {
      throw new NotFoundException(`Usuário com UUID ${uuid} não encontrado`);
    }

    return { fieldname: photo.fieldname, filename: photo.originalname };
  }

  async addTenancy(userUuid: string, tenancyUuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
      relations: ['tenancies'],
    });

    if (!user) {
      throw new NotFoundException(
        `Usuário com UUID ${userUuid} não encontrado`,
      );
    }

    const tenancy = await this.tenancyRepository.findOne({
      where: { uuid: tenancyUuid },
    });

    if (!tenancy) {
      throw new NotFoundException(
        `Tenancy com UUID ${tenancyUuid} não encontrada`,
      );
    }

    // Verificar se já está associado
    const isAlreadyAssociated = user.tenancies.some(
      t => t.uuid === tenancyUuid,
    );

    if (isAlreadyAssociated) {
      throw new ConflictException('Usuário já está associado a esta tenancy');
    }

    user.tenancies.push(tenancy);
    return this.userRepository.save(user);
  }

  async removeTenancy(userUuid: string, tenancyUuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
      relations: ['tenancies'],
    });

    if (!user) {
      throw new NotFoundException(
        `Usuário com UUID ${userUuid} não encontrado`,
      );
    }

    user.tenancies = user.tenancies.filter(t => t.uuid !== tenancyUuid);
    return this.userRepository.save(user);
  }

  async remove(uuid: string) {
    const user = await this.findOne(uuid);

    // Verificar se tem tenancies associadas
    if (user.tenancies && user.tenancies.length > 0) {
      throw new BadRequestException(
        'Não é possível remover usuário com tenancies associadas. Remova as associações primeiro.',
      );
    }

    return this.userRepository.delete(uuid);
  }

  // Verificar se usuário tem acesso a uma tenancy
  async hasAccessToTenancy(
    userUuid: string,
    tenancyUuid: string,
  ): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.tenancies', 'tenancy')
      .where('user.uuid = :userUuid', { userUuid })
      .andWhere('tenancy.uuid = :tenancyUuid', { tenancyUuid })
      .getOne();

    return !!user;
  }

  // Estatísticas
  async getStatistics() {
    const [total, withTenancy, avgTenanciesPerUser] = await Promise.all([
      this.userRepository.count(),
      this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.tenancies', 'tenancy')
        .getCount(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tenancies', 'tenancy')
        .select(
          'AVG(CASE WHEN tenancy.uuid IS NOT NULL THEN 1 ELSE 0 END)',
          'avg',
        )
        .getRawOne(),
    ]);

    return {
      total,
      withTenancy,
      withoutTenancy: total - withTenancy,
      avgTenanciesPerUser: parseFloat(avgTenanciesPerUser.avg) || 0,
    };
  }
}
