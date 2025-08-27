import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { Setor } from './setor.entity';
import { Profissional } from '../../profissionais/entities/profissional.entity';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';

@Entity('setor_profissional_tenancy')
@Index(['profissionalUuid', 'setorUuid', 'tenancyUuid'], { unique: true }) // setor_profissional_tenancy_unique
export class SetorProfissionalTenancy {
  @PrimaryColumn({ type: 'uuid', name: 'profissional_uuid' })
  profissionalUuid: string;

  @PrimaryColumn({ type: 'uuid', name: 'setor_uuid' })
  setorUuid: string;

  @PrimaryColumn({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Profissional)
  @JoinColumn({ name: 'profissional_uuid' })
  profissional: Profissional;

  @ManyToOne(() => Setor)
  @JoinColumn({ name: 'setor_uuid' })
  setor: Setor;

  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;
}
