import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';

@Entity('segmento')
export class Segmento {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({
    name: 'intervaloAlerta',
    type: 'integer',
    default: 24,
  })
  intervaloAlerta: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => Tenancy, tenancy => tenancy.segmento)
  tenancies: Tenancy[];
}
