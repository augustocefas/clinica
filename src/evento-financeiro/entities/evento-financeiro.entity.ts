import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatusFinanceiro } from '../../status-financeiro/entities/status-financeiro.entity';
import { Financeiro } from '../../financeiro/entities/financeiro.entity';

@Entity('evento_financeiro')
export class EventoFinanceiro {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'bigint', name: 'status_financeiro_id' })
  statusFinanceiroId: number;

  @Column({ type: 'uuid', name: 'financeiro_uuid' })
  financeiroUuid: string;

  @Column({ type: 'varchar', length: 128 })
  evento: string;

  @Column({ type: 'date', nullable: true, name: 'nova_data' })
  novaData?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(
    () => StatusFinanceiro,
    statusFinanceiro => statusFinanceiro.eventosFinanceiros,
  )
  @JoinColumn({ name: 'status_financeiro_id' })
  statusFinanceiro: StatusFinanceiro;

  @ManyToOne(() => Financeiro, financeiro => financeiro.eventosFinanceiros)
  @JoinColumn({ name: 'financeiro_uuid' })
  financeiro: Financeiro;
}
