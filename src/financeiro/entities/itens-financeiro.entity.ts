import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';

@Entity('itens_financeiro')
export class ItensFinanceiro {
  @PrimaryColumn('uuid', { name: 'financeiro_uuid' })
  financeiroUuid: string;

  @PrimaryColumn('uuid', { name: 'tenancy_uuid' })
  tenancyUuid: string;

  @PrimaryColumn('varchar', { length: 175 })
  descricao: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  quantidade: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'valor_unit',
  })
  valorUnit?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'valor_total',
  })
  valorTotal?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relacionamentos
  @ManyToOne('Financeiro', 'itensFinanceiros')
  @JoinColumn({ name: 'financeiro_uuid' })
  financeiro: any;

  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;
}
