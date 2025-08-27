import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacienteLogDto } from './dto/create-paciente-log.dto';
import { UpdatePacienteLogDto } from './dto/update-paciente-log.dto';
import { PacienteLog } from './entities/paciente-log.entity';

@Injectable()
export class PacienteLogService {
  constructor(
    @InjectRepository(PacienteLog)
    private readonly pacienteLogRepository: Repository<PacienteLog>,
  ) {}

  async create(
    createPacienteLogDto: CreatePacienteLogDto,
  ): Promise<PacienteLog> {
    const pacienteLog = this.pacienteLogRepository.create(createPacienteLogDto);
    return await this.pacienteLogRepository.save(pacienteLog);
  }

  async findAll(): Promise<PacienteLog[]> {
    return await this.pacienteLogRepository.find({
      relations: ['user', 'tenancy', 'paciente', 'dominioTipoAcesso'],
    });
  }

  async findByPaciente(pacienteUuid: string): Promise<PacienteLog[]> {
    return await this.pacienteLogRepository.find({
      where: { pacienteUuid },
      relations: ['user', 'tenancy', 'paciente', 'dominioTipoAcesso'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(usersUuid: string): Promise<PacienteLog[]> {
    return await this.pacienteLogRepository.find({
      where: { usersUuid },
      relations: ['user', 'tenancy', 'paciente', 'dominioTipoAcesso'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTenancy(tenancyUuid: string): Promise<PacienteLog[]> {
    return await this.pacienteLogRepository.find({
      where: { tenancyUuid },
      relations: ['user', 'tenancy', 'paciente', 'dominioTipoAcesso'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    usersUuid: string,
    tenancyUuid: string,
    pacienteUuid: string,
    dominioTipoAcessoId: number,
  ): Promise<PacienteLog> {
    return await this.pacienteLogRepository.findOne({
      where: {
        usersUuid,
        tenancyUuid,
        pacienteUuid,
        dominioTipoAcessoId,
      },
      relations: ['user', 'tenancy', 'paciente', 'dominioTipoAcesso'],
    });
  }

  async update(
    usersUuid: string,
    tenancyUuid: string,
    pacienteUuid: string,
    dominioTipoAcessoId: number,
    updatePacienteLogDto: UpdatePacienteLogDto,
  ): Promise<PacienteLog> {
    await this.pacienteLogRepository.update(
      {
        usersUuid,
        tenancyUuid,
        pacienteUuid,
        dominioTipoAcessoId,
      },
      updatePacienteLogDto,
    );
    return this.findOne(
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
    );
  }

  async remove(
    usersUuid: string,
    tenancyUuid: string,
    pacienteUuid: string,
    dominioTipoAcessoId: number,
  ): Promise<void> {
    await this.pacienteLogRepository.delete({
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
    });
  }

  // Método utilitário para registrar acesso de usuário a paciente
  async registrarAcesso(
    usersUuid: string,
    tenancyUuid: string,
    pacienteUuid: string,
    dominioTipoAcessoId: number,
  ): Promise<PacienteLog> {
    return this.create({
      usersUuid,
      tenancyUuid,
      pacienteUuid,
      dominioTipoAcessoId,
    });
  }
}
