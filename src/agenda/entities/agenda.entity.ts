import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Exame } from 'src/exames/entities/exame.entity';
import { Profissional } from 'src/profissionais/entities/profissional.entity';
import { AgendaProcedimentoTenancy } from './agenda-procedimento-tenancy.entity';
import { Solicitacao } from 'src/solicitacao/entities/solicitacao.entity';

@Entity('agenda')
@Index(['pacienteUuid', 'dataConsulta', 'horarioInicio'], { unique: true })
@Index(['profissionalUuid', 'dataConsulta', 'horarioInicio'], { unique: true })
export class Agenda {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @Column({ type: 'uuid', name: 'paciente_uuid' })
  pacienteUuid: string;

  @Column({ type: 'uuid', name: 'exame_uuid', nullable: true })
  exameUuid?: string;

  @Column({ type: 'uuid', name: 'profissional_uuid' })
  profissionalUuid: string;

  @Column({ type: 'date', name: 'data_consulta', nullable: true })
  dataConsulta?: Date;

  @Column({ type: 'time', name: 'horario_inicio', nullable: true })
  horarioInicio?: string;

  @Column({ type: 'time', name: 'horario_fim', nullable: true })
  horarioFim?: string;

  @Column({ type: 'varchar', length: 175, nullable: true })
  recomendacao?: string;

  @Column({ type: 'varchar', length: 175, nullable: true })
  obs?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  desconto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  recebido: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relacionamentos
  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_uuid' })
  paciente: Paciente;

  @ManyToOne(() => Exame, { nullable: true })
  @JoinColumn({ name: 'exame_uuid' })
  exame?: Exame;

  @ManyToOne(() => Profissional)
  @JoinColumn({ name: 'profissional_uuid' })
  profissional: Profissional;

  @OneToMany(
    () => AgendaProcedimentoTenancy,
    agendaProcedimento => agendaProcedimento.agenda,
  )
  agendaProcedimentos: AgendaProcedimentoTenancy[];

  @OneToMany(() => Solicitacao, solicitacao => solicitacao.agenda)
  solicitacoes: Solicitacao[];
}
