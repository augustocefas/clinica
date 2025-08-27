import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { Agenda } from './agenda.entity';
import { Procedimento } from 'src/procedimentos/entities/procedimento.entity';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';

@Entity('agenda_procedimento_tenancy')
@Index(['agendaUuid'])
@Index(['procedimentoUuid'])
@Index(['tenancyUuid'])
export class AgendaProcedimentoTenancy {
  @PrimaryColumn({ type: 'uuid', name: 'agenda_uuid' })
  agendaUuid: string;

  @PrimaryColumn({ type: 'uuid', name: 'procedimento_uuid' })
  procedimentoUuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Agenda, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agenda_uuid' })
  agenda: Agenda;

  @ManyToOne(() => Procedimento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'procedimento_uuid' })
  procedimento: Procedimento;

  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;
}
