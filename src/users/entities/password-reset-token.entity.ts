import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relacionamento opcional com User (baseado no email)
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user?: User;
}
