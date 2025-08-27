import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('dominio')
export class Dominio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', name: 'tipo_dominio_id' })
  tipoDominioId: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  nome: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  cor?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos - usando lazy loading para evitar referência circular
  @ManyToOne('TipoDominio', {
    eager: true,
  })
  @JoinColumn({ name: 'tipo_dominio_id' })
  tipoDominio: any;
}
