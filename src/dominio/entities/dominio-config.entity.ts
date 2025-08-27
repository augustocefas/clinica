import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('dominio_config')
export class DominioConfig {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', name: 'tipodominio_config_id' })
  tipoDominioConfigId: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  nome: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  cor?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos - usando lazy loading para evitar referência circular
  @ManyToOne('TipoDominioConfig', {
    eager: true,
  })
  @JoinColumn({ name: 'tipodominio_config_id' })
  tipoDominioConfig: any;
}
