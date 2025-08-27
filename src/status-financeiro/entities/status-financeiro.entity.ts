import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('status_financeiro')
export class StatusFinanceiro {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  tag: string;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  cor: string;

  @Column({ type: 'varchar', length: 3, default: '0', name: 'menos_dias' })
  menosDias: string;

  @Column({ type: 'varchar', length: 3, default: '0', name: 'mais_dias' })
  maisDias: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos - definidos usando string para evitar circular imports
  @OneToMany('Financeiro', 'statusFinanceiro')
  financeiros: any[];

  @OneToMany('EventoFinanceiro', 'statusFinanceiro')
  eventosFinanceiros: any[];
}
