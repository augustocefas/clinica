import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plano } from 'src/planos/entities/plano.entity';
import { Segmento } from 'src/segmento/entities/segmento.entity';

@Entity('tenancy')
export class Tenancy {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'bigint', name: 'segmento_id', nullable: true })
  segmentoId?: number;

  @Column({ type: 'boolean', default: true })
  prepago: boolean;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'bigint', name: 'plano_id', nullable: true })
  planoId?: number;

  @ManyToOne(() => Plano, { nullable: true })
  @JoinColumn({ name: 'plano_id' })
  plano?: Plano;

  @ManyToOne(() => Segmento, { nullable: true })
  @JoinColumn({ name: 'segmento_id' })
  segmento?: Segmento;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
