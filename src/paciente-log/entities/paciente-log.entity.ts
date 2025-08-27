import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenancy } from '../../tenancy/entities/tenancy.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Dominio } from '../../dominio/entities/dominio.entity';

@Entity('paciente_log')
export class PacienteLog {
  @PrimaryColumn('uuid', { name: 'users_uuid' })
  usersUuid: string;

  @PrimaryColumn('uuid', { name: 'tenancy_uuid' })
  tenancyUuid: string;

  @PrimaryColumn('uuid', { name: 'paciente_uuid' })
  pacienteUuid: string;

  @PrimaryColumn('bigint', { name: 'DominioTipoAcesso_id' })
  dominioTipoAcessoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'users_uuid' })
  user: User;

  @ManyToOne(() => Tenancy, { eager: true })
  @JoinColumn({ name: 'tenancy_uuid' })
  tenancy: Tenancy;

  @ManyToOne(() => Paciente, { eager: true })
  @JoinColumn({ name: 'paciente_uuid' })
  paciente: Paciente;

  @ManyToOne(() => Dominio, { eager: true })
  @JoinColumn({ name: 'DominioTipoAcesso_id' })
  dominioTipoAcesso: Dominio;
}
