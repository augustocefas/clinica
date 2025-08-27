import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';
import { AgendaProcedimentoTenancy } from 'src/agenda/entities/agenda-procedimento-tenancy.entity';

@Entity('procedimento')
export class Procedimento {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  abreviacao?: string;

  @Column({
    type: 'varchar',
    length: 3,
    name: 'TempoMedioMinutos',
    nullable: true,
  })
  tempoMedioMinutos?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  @OneToMany(
    () => AgendaProcedimentoTenancy,
    agendaProcedimento => agendaProcedimento.procedimento,
  )
  agendaProcedimentos: AgendaProcedimentoTenancy[];
}
