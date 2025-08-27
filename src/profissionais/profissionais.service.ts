import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { Profissional } from './entities/profissional.entity';

@Injectable()
export class ProfissionaisService {
  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  create(createProfissionalDto: CreateProfissionalDto) {
    const profissional = this.profissionalRepository.create(
      createProfissionalDto,
    );
    return this.profissionalRepository.save(profissional);
  }

  findAll() {
    return this.profissionalRepository.find({
      relations: ['tenancy'],
    });
  }

  async findOne(uuid: string) {
    const profissional = await this.profissionalRepository.findOne({
      where: { uuid },
      relations: ['tenancy'],
    });

    if (!profissional) {
      throw new NotFoundException(
        `Profissional com UUID ${uuid} não encontrado`,
      );
    }

    return profissional;
  }

  findByTenancy(tenancyUuid: string) {
    return this.profissionalRepository.find({
      where: { tenancyUuid },
      relations: ['tenancy'],
    });
  }

  findByConselho(conselho: string, numeroConselho: string) {
    return this.profissionalRepository.findOne({
      where: { conselho, numeroConselho },
      relations: ['tenancy'],
    });
  }

  async update(uuid: string, updateProfissionalDto: UpdateProfissionalDto) {
    await this.findOne(uuid); // Verifica se existe
    await this.profissionalRepository.update(uuid, updateProfissionalDto);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    await this.findOne(uuid); // Verifica se existe
    return this.profissionalRepository.softDelete(uuid);
  }
}
