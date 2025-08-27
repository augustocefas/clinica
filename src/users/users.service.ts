import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(Tenancy)
    private tenancyRepository: Repository<Tenancy>,
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
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

  async updatePassword(uuid: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { uuid },
      select: ['uuid', 'password'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com UUID ${uuid} não encontrado`);
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      saltRounds,
    );

    await this.userRepository.update(uuid, {
      password: hashedNewPassword,
    });

    return { message: 'Senha atualizada com sucesso' };
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

  // Método para autenticação (validar credenciais)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['uuid', 'name', 'email', 'password'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
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

  // Métodos para redefinição de senha
  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');

    // Remover token anterior se existir
    await this.passwordResetTokenRepository.delete({ email });

    // Criar novo token
    const passwordResetToken = this.passwordResetTokenRepository.create({
      email,
      token,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    return {
      message: 'Token de redefinição de senha criado com sucesso',
      token, // Em produção, este token seria enviado por email
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, token, newPassword } = resetPasswordDto;

    // Verificar se o token existe e é válido
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { email, token },
    });

    if (!passwordResetToken) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Verificar se o token não expirou (30 minutos)
    const tokenAge =
      new Date().getTime() - passwordResetToken.createdAt.getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (tokenAge > thirtyMinutesInMs) {
      await this.passwordResetTokenRepository.delete({ email });
      throw new BadRequestException('Token expirado');
    }

    // Buscar usuário
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    // Hash da nova senha
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await this.userRepository.update(user.uuid, {
      password: hashedNewPassword,
    });

    // Remover token usado
    await this.passwordResetTokenRepository.delete({ email });

    return { message: 'Senha redefinida com sucesso' };
  }

  async validatePasswordResetToken(email: string, token: string) {
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { email, token },
    });

    if (!passwordResetToken) {
      return { valid: false, message: 'Token inválido' };
    }

    // Verificar se o token não expirou (30 minutos)
    const tokenAge =
      new Date().getTime() - passwordResetToken.createdAt.getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (tokenAge > thirtyMinutesInMs) {
      await this.passwordResetTokenRepository.delete({ email });
      return { valid: false, message: 'Token expirado' };
    }

    return { valid: true, message: 'Token válido' };
  }
}
