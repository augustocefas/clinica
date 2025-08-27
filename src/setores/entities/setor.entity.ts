import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
import { SetorProfissionalTenancy } from './setor-profissional-tenancy.entity';

@Entity('setor')
@Index(['tenancyUuid', 'nome'], { unique: true }) // setor_tenancy_nome_unique
export class Setor {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  // Relacionamento com a tabela de junção setor_profissional_tenancy
  @OneToMany(
    () => SetorProfissionalTenancy,
    setorProfissional => setorProfissional.setor,
  )
  setorProfissionais: SetorProfissionalTenancy[];

  // Relacionamento Many-to-Many com Profissionais através da tabela setor_profissional_tenancy
  // @ManyToMany(() => Profissional)
  // @JoinTable({
  //   name: 'setor_profissional_tenancy',
  //   joinColumn: { name: 'setor_uuid', referencedColumnName: 'uuid' },
  //   inverseJoinColumn: { name: 'profissional_uuid', referencedColumnName: 'uuid' },
  // })
  // profissionais: Profissional[];

  // Relacionamento com Exames será adicionado depois
  // @OneToMany(() => Exame, exame => exame.setor)
  // exames: Exame[];

  // Relacionamento com GrupoExame será adicionado depois
  // @OneToMany(() => GrupoExame, grupoExame => grupoExame.setor)
  // grupoExames: GrupoExame[];
}
