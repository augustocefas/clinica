import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { Tenancy } from '../tenancy/entities/tenancy.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Tenancy)
    private readonly tenancyRepository: Repository<Tenancy>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto) {
    const { tenancyUuids, ...pacienteData } = createPacienteDto;

    const paciente = this.pacienteRepository.create(pacienteData);

    if (tenancyUuids && tenancyUuids.length > 0) {
      const tenancies = await this.tenancyRepository.find({
        where: { uuid: In(tenancyUuids) },
      });
      paciente.tenancies = tenancies;
    }

    return this.pacienteRepository.save(paciente);
  }

  findAll() {
    return this.pacienteRepository.find({
      relations: ['tenancies'],
    });
  }

  async findOne(uuid: string) {
    const paciente = await this.pacienteRepository.findOne({
      where: { uuid },
      relations: ['tenancies'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente com UUID ${uuid} não encontrado`);
    }

    return paciente;
  }

  findByCpf(cpf: string) {
    return this.pacienteRepository.findOne({
      where: { cpf },
      relations: ['tenancies'],
    });
  }

  findByTenancy(tenancyUuid: string) {
    return this.pacienteRepository
      .createQueryBuilder('paciente')
      .innerJoin('paciente.tenancies', 'tenancy')
      .where('tenancy.uuid = :tenancyUuid', { tenancyUuid })
      .getMany();
  }

  async update(uuid: string, updatePacienteDto: UpdatePacienteDto) {
    const { tenancyUuids, ...pacienteData } = updatePacienteDto;

    const paciente = await this.findOne(uuid);

    if (tenancyUuids) {
      const tenancies = await this.tenancyRepository.find({
        where: { uuid: In(tenancyUuids) },
      });
      paciente.tenancies = tenancies;
    }

    Object.assign(paciente, pacienteData);
    return this.pacienteRepository.save(paciente);
  }

  async remove(uuid: string) {
    await this.findOne(uuid); // Verifica se existe
    return this.pacienteRepository.softDelete(uuid);
  }
}
