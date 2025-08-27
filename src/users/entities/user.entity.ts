import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tenancy } from 'src/tenancy/entities/tenancy.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'timestamp', name: 'email_verified_at', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'remember_token',
    nullable: true,
  })
  rememberToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos Many-to-Many com Tenancy
  @ManyToMany(() => Tenancy, { cascade: true })
  @JoinTable({
    name: 'users_tenancy',
    joinColumn: { name: 'users_uuid', referencedColumnName: 'uuid' },
    inverseJoinColumn: { name: 'tenancy_uuid', referencedColumnName: 'uuid' },
  })
  tenancies: Tenancy[];
}
