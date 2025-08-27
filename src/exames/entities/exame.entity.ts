import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profissional } from '../../profissionais/entities/profissional.entity';
import { Setor } from '../../setores/entities/setor.entity';
import { GrupoExame } from '../../grupo-exame/entities/grupo-exame.entity';

@Entity('exame')
export class Exame {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @Column({ type: 'uuid', name: 'setor_uuid' })
  setorUuid: string;

  @Column({ type: 'uuid', name: 'paciente_uuid' })
  pacienteUuid: string;

  @Column({ type: 'uuid', name: 'grupoexame_uuid' })
  grupoexameUuid: string;

  @Column({ type: 'uuid', name: 'profissional_uuid' })
  profissionalUuid: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'date', nullable: true, name: 'data_exame' })
  dataExame?: Date;

  @Column({ type: 'time', nullable: true, name: 'horario_inicio_exame' })
  horarioInicioExame?: string;

  @Column({ type: 'time', nullable: true, name: 'horario_fim_exame' })
  horarioFimExame?: string;

  @Column({ type: 'date', nullable: true, name: 'previsao_laudo' })
  previsaoLaudo?: Date;

  @Column({
    type: 'varchar',
    length: 175,
    nullable: true,
    name: 'laudo_nome_arquivo',
  })
  laudoNomeArquivo?: string;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'chave_acesso' })
  chaveAcesso?: string;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'contra_chave' })
  contraChave?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor: number;

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

  @ManyToOne(() => Profissional)
  @JoinColumn({ name: 'profissional_uuid' })
  profissional: Profissional;

  @ManyToOne(() => Setor)
  @JoinColumn({ name: 'setor_uuid' })
  setor: Setor;

  @ManyToOne(() => GrupoExame)
  @JoinColumn({ name: 'grupoexame_uuid' })
  grupoExame: GrupoExame;
}
