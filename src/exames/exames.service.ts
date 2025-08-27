import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { Exame } from './entities/exame.entity';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
  ) {}

  create(createExameDto: CreateExameDto) {
    const exame = this.exameRepository.create(createExameDto);
    return this.exameRepository.save(exame);
  }

  findAll() {
    return this.exameRepository.find({
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  async findOne(uuid: string) {
    const exame = await this.exameRepository.findOne({
      where: { uuid },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });

    if (!exame) {
      throw new NotFoundException(`Exame com UUID ${uuid} não encontrado`);
    }

    return exame;
  }

  findByTenancy(tenancyUuid: string) {
    return this.exameRepository.find({
      where: { tenancyUuid },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  findByPaciente(pacienteUuid: string) {
    return this.exameRepository.find({
      where: { pacienteUuid },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  findByProfissional(profissionalUuid: string) {
    return this.exameRepository.find({
      where: { profissionalUuid },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  findBySetor(setorUuid: string) {
    return this.exameRepository.find({
      where: { setorUuid },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  findByChaveAcesso(chaveAcesso: string) {
    return this.exameRepository.findOne({
      where: { chaveAcesso },
      relations: ['tenancy', 'paciente', 'profissional', 'setor'],
    });
  }

  async update(uuid: string, updateExameDto: UpdateExameDto) {
    await this.findOne(uuid); // Verifica se existe
    await this.exameRepository.update(uuid, updateExameDto);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    await this.findOne(uuid); // Verifica se existe
    return this.exameRepository.softDelete(uuid);
  }
}
