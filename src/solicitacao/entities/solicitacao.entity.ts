import { Entity, ManyToOne, JoinColumn, Index, PrimaryColumn } from 'typeorm';
import { Agenda } from 'src/agenda/entities/agenda.entity';

@Entity('solicitacao')
@Index(['agendaUuid'])
@Index(['descricao'])
export class Solicitacao {
  @PrimaryColumn({ type: 'uuid', name: 'agenda_uuid' })
  agendaUuid: string;

  @PrimaryColumn({ type: 'varchar', length: 175, name: 'descricao' })
  descricao: string;

  // Relacionamentos
  @ManyToOne(() => Agenda)
  @JoinColumn({ name: 'agenda_uuid' })
  agenda: Agenda;
}
