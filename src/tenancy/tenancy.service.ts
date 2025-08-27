import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { UpdateTenancyDto } from './dto/update-tenancy.dto';
import { Tenancy } from './entities/tenancy.entity';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenancy)
    private readonly tenancyRepository: Repository<Tenancy>,
  ) {}

  create(createTenancyDto: CreateTenancyDto) {
    const tenancy = this.tenancyRepository.create(createTenancyDto);
    return this.tenancyRepository.save(tenancy);
  }

  findAll() {
    return this.tenancyRepository.find();
  }

  findOne(uuid: string) {
    return this.tenancyRepository.findOne({
      where: { uuid },
    });
  }

  findBySlug(slug: string) {
    return this.tenancyRepository.findOne({
      where: { slug },
    });
  }

  update(uuid: string, updateTenancyDto: UpdateTenancyDto) {
    return this.tenancyRepository.update(uuid, updateTenancyDto);
  }

  remove(uuid: string) {
    return this.tenancyRepository.delete(uuid);
  }
}
