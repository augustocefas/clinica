import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
import { StatusFinanceiro } from '../../status-financeiro/entities/status-financeiro.entity';

@Entity('financeiro')
export class Financeiro {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'uuid', name: 'tenancy_uuid' })
  tenancyUuid: string;

  @Column({ type: 'varchar', length: 64, name: 'numero_sequencial' })
  numeroSequencial: string;

  @Column({ type: 'bigint', name: 'status_financeiro_id' })
  statusFinanceiroId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'valor_original',
  })
  valorOriginal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  juros: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  multa: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'valor_pago',
  })
  valorPago: number;

  @Column({ type: 'date', nullable: true, name: 'data_vencimento' })
  dataVencimento?: Date;

  @Column({ type: 'date', nullable: true, name: 'data_pagamento' })
  dataPagamento?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Tenancy)
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  @ManyToOne(() => StatusFinanceiro)
  @JoinColumn({ name: 'status_financeiro_id' })
  statusFinanceiro: StatusFinanceiro;

  @OneToMany('EventoFinanceiro', 'financeiro')
  eventosFinanceiros: any[];

  @OneToMany('ItensFinanceiro', 'financeiro')
  itensFinanceiros: any[];
}
