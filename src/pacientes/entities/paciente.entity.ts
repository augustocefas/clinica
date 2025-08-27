import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';

export enum SexoEnum {
  MASCULINO = 'M',
  FEMININO = 'F',
  OUTRO = 'O',
}

@Entity('paciente')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 128 })
  nome: string;

  @Column({ type: 'varchar', length: 16, nullable: true, unique: true })
  cpf?: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  rg?: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  emissor?: string;

  @Column({ type: 'varchar', length: 16, nullable: true, name: 'emissor_uf' })
  emissorUf?: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  celular?: string;

  @Column({ type: 'date', nullable: true })
  nascimento?: Date;

  @Column({
    type: 'enum',
    enum: SexoEnum,
    default: SexoEnum.OUTRO,
  })
  sexo: SexoEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relacionamentos Many-to-Many com Tenancy
  @ManyToMany(() => Tenancy)
  @JoinTable({
    name: 'paciente_tenancy',
    joinColumn: { name: 'paciente_uuid', referencedColumnName: 'uuid' },
    inverseJoinColumn: { name: 'tenancy_uuid', referencedColumnName: 'uuid' },
  })
  tenancies: Tenancy[];

  // Relacionamento com Exames será adicionado depois
  // @OneToMany(() => Exame, exame => exame.paciente)
  // exames: Exame[];
}
