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

@Entity('profissional')
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 128 })
  nome: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  conselho?: string; // CRM, CRP, CRO, etc.

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
    name: 'numero_conselho',
  })
  numeroConselho?: string; // Número do conselho profissional

  @Column({ type: 'varchar', length: 64, nullable: true })
  especialidade?: string; // Especialidade do profissional

  @Column({ type: 'varchar', length: 32, name: 'SomaTempoConsulta' })
  somaTempoConsulta: string; // minutos

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

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

  // Relacionamento com Setores será adicionado depois
  // @ManyToMany(() => Setor, setor => setor.profissionais)
  // @JoinTable({
  //   name: 'setor_profissional_tenancy',
  //   joinColumn: { name: 'profissional_uuid', referencedColumnName: 'uuid' },
  //   inverseJoinColumn: { name: 'setor_uuid', referencedColumnName: 'uuid' },
  // })
  // setores: Setor[];

  // Relacionamento com Exames será adicionado depois
  // @OneToMany(() => Exame, exame => exame.profissional)
  // exames: Exame[];
}
