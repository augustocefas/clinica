import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDominioDto } from './dto/create-dominio.dto';
import { UpdateDominioDto } from './dto/update-dominio.dto';
import { CreateTipoDominioDto } from './dto/create-tipo-dominio.dto';
import { UpdateTipoDominioDto } from './dto/update-tipo-dominio.dto';
import { CreateDominioConfigDto } from './dto/create-dominio-config.dto';
import { UpdateDominioConfigDto } from './dto/update-dominio-config.dto';
import { CreateTipoDominioConfigDto } from './dto/create-tipo-dominio-config.dto';
import { UpdateTipoDominioConfigDto } from './dto/update-tipo-dominio-config.dto';
import { Dominio } from './entities/dominio.entity';
import { TipoDominio } from './entities/tipo-dominio.entity';
import { DominioConfig } from './entities/dominio-config.entity';
import { TipoDominioConfig } from './entities/tipo-dominio-config.entity';

@Injectable()
export class DominioService {
  constructor(
    @InjectRepository(Dominio)
    private readonly dominioRepository: Repository<Dominio>,
    @InjectRepository(TipoDominio)
    private readonly tipoDominioRepository: Repository<TipoDominio>,
    @InjectRepository(DominioConfig)
    private readonly dominioConfigRepository: Repository<DominioConfig>,
    @InjectRepository(TipoDominioConfig)
    private readonly tipoDominioConfigRepository: Repository<TipoDominioConfig>,
  ) {}

  // CRUD para Dominio
  async createDominio(createDominioDto: CreateDominioDto): Promise<Dominio> {
    const dominio = this.dominioRepository.create(createDominioDto);
    return await this.dominioRepository.save(dominio);
  }

  async findAllDominios(): Promise<Dominio[]> {
    return await this.dominioRepository.find({
      relations: ['tipoDominio'],
    });
  }

  async findOneDominio(id: number): Promise<Dominio> {
    return await this.dominioRepository.findOne({
      where: { id },
      relations: ['tipoDominio'],
    });
  }

  async updateDominio(
    id: number,
    updateDominioDto: UpdateDominioDto,
  ): Promise<Dominio> {
    await this.dominioRepository.update(id, updateDominioDto);
    return this.findOneDominio(id);
  }

  async removeDominio(id: number): Promise<void> {
    await this.dominioRepository.delete(id);
  }

  // CRUD para TipoDominio
  async createTipoDominio(
    createTipoDominioDto: CreateTipoDominioDto,
  ): Promise<TipoDominio> {
    const tipoDominio = this.tipoDominioRepository.create(createTipoDominioDto);
    return await this.tipoDominioRepository.save(tipoDominio);
  }

  async findAllTipoDominios(): Promise<TipoDominio[]> {
    return await this.tipoDominioRepository.find();
  }

  async findOneTipoDominio(id: number): Promise<TipoDominio> {
    return await this.tipoDominioRepository.findOne({
      where: { id },
    });
  }

  async updateTipoDominio(
    id: number,
    updateTipoDominioDto: UpdateTipoDominioDto,
  ): Promise<TipoDominio> {
    await this.tipoDominioRepository.update(id, updateTipoDominioDto);
    return this.findOneTipoDominio(id);
  }

  async removeTipoDominio(id: number): Promise<void> {
    await this.tipoDominioRepository.delete(id);
  }

  // CRUD para DominioConfig
  async createDominioConfig(
    createDominioConfigDto: CreateDominioConfigDto,
  ): Promise<DominioConfig> {
    const dominioConfig = this.dominioConfigRepository.create(
      createDominioConfigDto,
    );
    return await this.dominioConfigRepository.save(dominioConfig);
  }

  async findAllDominioConfigs(): Promise<DominioConfig[]> {
    return await this.dominioConfigRepository.find({
      relations: ['tipoDominioConfig'],
    });
  }

  async findOneDominioConfig(id: number): Promise<DominioConfig> {
    return await this.dominioConfigRepository.findOne({
      where: { id },
      relations: ['tipoDominioConfig'],
    });
  }

  async updateDominioConfig(
    id: number,
    updateDominioConfigDto: UpdateDominioConfigDto,
  ): Promise<DominioConfig> {
    await this.dominioConfigRepository.update(id, updateDominioConfigDto);
    return this.findOneDominioConfig(id);
  }

  async removeDominioConfig(id: number): Promise<void> {
    await this.dominioConfigRepository.delete(id);
  }

  // CRUD para TipoDominioConfig
  async createTipoDominioConfig(
    createTipoDominioConfigDto: CreateTipoDominioConfigDto,
  ): Promise<TipoDominioConfig> {
    const tipoDominioConfig = this.tipoDominioConfigRepository.create(
      createTipoDominioConfigDto,
    );
    return await this.tipoDominioConfigRepository.save(tipoDominioConfig);
  }

  async findAllTipoDominioConfigs(): Promise<TipoDominioConfig[]> {
    return await this.tipoDominioConfigRepository.find();
  }

  async findOneTipoDominioConfig(id: number): Promise<TipoDominioConfig> {
    return await this.tipoDominioConfigRepository.findOne({
      where: { id },
    });
  }

  async updateTipoDominioConfig(
    id: number,
    updateTipoDominioConfigDto: UpdateTipoDominioConfigDto,
  ): Promise<TipoDominioConfig> {
    await this.tipoDominioConfigRepository.update(
      id,
      updateTipoDominioConfigDto,
    );
    return this.findOneTipoDominioConfig(id);
  }

  async removeTipoDominioConfig(id: number): Promise<void> {
    await this.tipoDominioConfigRepository.delete(id);
  }
}
