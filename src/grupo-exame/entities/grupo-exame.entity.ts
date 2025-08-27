import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
import { Setor } from '../../setores/entities/setor.entity';
import { Exame } from '../../exames/entities/exame.entity';

@Entity('grupoexame')
@Check('previsao_tempo_check', `previsao_tempo IN ('horas', 'dias')`)
export class GrupoExame {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'setor_id', type: 'uuid' })
  setorId: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({
    name: 'detalhamento',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  detalhamento?: string;

  @Column({
    name: 'descricao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descricao?: string;

  @Column({
    name: 'previsao_tempo',
    type: 'varchar',
    length: 255,
    default: 'horas',
  })
  previsaoTempo: 'horas' | 'dias';

  @Column({
    name: 'previsao_laudo_tempo',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  previsaoLaudoTempo?: string;

  @Column({
    name: 'valor',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valor: number;

  @Column({ name: 'tenancy_uuid', type: 'uuid' })
  tenancyUuid: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Relacionamentos
  @ManyToOne(() => Tenancy, { eager: false })
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  @ManyToOne(() => Setor, { eager: false })
  @JoinColumn({ name: 'setor_id' })
  setor: Setor;

  @OneToMany(() => Exame, exame => exame.grupoExame)
  exames: Exame[];
}
