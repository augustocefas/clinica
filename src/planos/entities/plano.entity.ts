import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plano')
export class Plano {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({
    type: 'varchar',
    length: 4,
    default: '20',
    name: 'total_equipamento',
  })
  totalEquipamento: string;

  @Column({ type: 'boolean', default: false, name: 'integracao_whatsapp' })
  integracaoWhatsapp: boolean;

  @Column({ type: 'boolean', default: false, name: 'integracao_sms' })
  integracaoSms: boolean;

  @Column({ type: 'boolean', default: false, name: 'integracao_email' })
  integracaoEmail: boolean;

  @Column({ type: 'boolean', default: true, name: 'integracao_api' })
  integracaoApi: boolean;

  @Column({ type: 'boolean', default: false, name: 'habilita_cliente' })
  habilitaCliente: boolean;

  @Column({ type: 'boolean', default: false, name: 'habilita_produto' })
  habilitaProduto: boolean;

  @Column({ type: 'boolean', default: false, name: 'habilita_botox' })
  habilitaBotox: boolean;

  @Column({ type: 'boolean', default: false, name: 'habilita_laudo' })
  habilitaLaudo: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'custo_sms',
  })
  custoSms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'valor_promo',
  })
  valorPromo: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'valor_setor',
  })
  valorSetor: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'valor_valor_profissional',
  })
  valorValorProfissional: number;

  @Column({ type: 'integer', default: 1, name: 'soma_dias' })
  somaDias: number;

  @Column({ type: 'integer', default: 0, name: 'bonus_dias' })
  bonusDias: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  // @OneToMany(() => Tenancy, tenancy => tenancy.plano)
  // tenancies: Tenancy[];
}
