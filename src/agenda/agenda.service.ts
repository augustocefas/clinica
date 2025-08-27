import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { AddProcedimentoToAgendaDto } from './dto/add-procedimento-to-agenda.dto';
import { Agenda } from './entities/agenda.entity';
import { AgendaProcedimentoTenancy } from './entities/agenda-procedimento-tenancy.entity';
import { AgendaWithProcedimentos } from './interfaces/agenda-procedimento.interface';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    @InjectRepository(AgendaProcedimentoTenancy)
    private agendaProcedimentoRepository: Repository<AgendaProcedimentoTenancy>,
  ) {}

  async create(createAgendaDto: CreateAgendaDto) {
    // Verificar conflitos de horário para o paciente
    if (createAgendaDto.dataConsulta && createAgendaDto.horarioInicio) {
      const conflitoPaciente = await this.agendaRepository.findOne({
        where: {
          pacienteUuid: createAgendaDto.pacienteUuid,
          dataConsulta: new Date(createAgendaDto.dataConsulta),
          horarioInicio: createAgendaDto.horarioInicio,
        },
      });

      if (conflitoPaciente) {
        throw new ConflictException(
          'Já existe um agendamento para este paciente no mesmo horário',
        );
      }

      // Verificar conflitos de horário para o profissional
      const conflitoProfissional = await this.agendaRepository.findOne({
        where: {
          profissionalUuid: createAgendaDto.profissionalUuid,
          dataConsulta: new Date(createAgendaDto.dataConsulta),
          horarioInicio: createAgendaDto.horarioInicio,
        },
      });

      if (conflitoProfissional) {
        throw new ConflictException(
          'Já existe um agendamento para este profissional no mesmo horário',
        );
      }
    }

    // Calcular saldo automaticamente
    const subtotal = createAgendaDto.subtotal || 0;
    const desconto = createAgendaDto.desconto || 0;
    const recebido = createAgendaDto.recebido || 0;
    const saldo = subtotal - desconto - recebido;

    const agenda = this.agendaRepository.create({
      ...createAgendaDto,
      dataConsulta: createAgendaDto.dataConsulta
        ? new Date(createAgendaDto.dataConsulta)
        : undefined,
      saldo,
    });

    return this.agendaRepository.save(agenda);
  }

  findAll() {
    return this.agendaRepository.find({
      relations: ['tenancy', 'paciente', 'exame', 'profissional'],
      order: { dataConsulta: 'ASC', horarioInicio: 'ASC' },
    });
  }

  findByTenancy(tenancyUuid: string) {
    return this.agendaRepository.find({
      where: { tenancyUuid },
      relations: ['paciente', 'exame', 'profissional'],
      order: { dataConsulta: 'ASC', horarioInicio: 'ASC' },
    });
  }

  findByPaciente(pacienteUuid: string) {
    return this.agendaRepository.find({
      where: { pacienteUuid },
      relations: ['tenancy', 'exame', 'profissional'],
      order: { dataConsulta: 'DESC' },
    });
  }

  findByProfissional(profissionalUuid: string) {
    return this.agendaRepository.find({
      where: { profissionalUuid },
      relations: ['tenancy', 'paciente', 'exame'],
      order: { dataConsulta: 'ASC', horarioInicio: 'ASC' },
    });
  }

  findByDateRange(startDate: string, endDate: string) {
    return this.agendaRepository.find({
      where: {
        dataConsulta: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['tenancy', 'paciente', 'exame', 'profissional'],
      order: { dataConsulta: 'ASC', horarioInicio: 'ASC' },
    });
  }

  findAgendaByDate(date: string) {
    return this.agendaRepository.find({
      where: { dataConsulta: new Date(date) },
      relations: ['paciente', 'exame', 'profissional'],
      order: { horarioInicio: 'ASC' },
    });
  }

  async findOne(uuid: string) {
    const agenda = await this.agendaRepository.findOne({
      where: { uuid },
      relations: ['tenancy', 'paciente', 'exame', 'profissional'],
    });

    if (!agenda) {
      throw new NotFoundException(`Agenda com UUID ${uuid} não encontrada`);
    }

    return agenda;
  }

  async update(uuid: string, updateAgendaDto: UpdateAgendaDto) {
    const agenda = await this.findOne(uuid);

    // Verificar conflitos de horário se data/horário foram alterados
    if (updateAgendaDto.dataConsulta || updateAgendaDto.horarioInicio) {
      const dataConsulta = updateAgendaDto.dataConsulta
        ? new Date(updateAgendaDto.dataConsulta)
        : agenda.dataConsulta;
      const horarioInicio =
        updateAgendaDto.horarioInicio || agenda.horarioInicio;
      const pacienteUuid = updateAgendaDto.pacienteUuid || agenda.pacienteUuid;
      const profissionalUuid =
        updateAgendaDto.profissionalUuid || agenda.profissionalUuid;

      if (dataConsulta && horarioInicio) {
        // Verificar conflito de paciente (exceto o próprio registro)
        const conflitoPaciente = await this.agendaRepository.findOne({
          where: {
            pacienteUuid,
            dataConsulta,
            horarioInicio,
            uuid: { $ne: uuid } as any,
          },
        });

        if (conflitoPaciente) {
          throw new ConflictException(
            'Já existe um agendamento para este paciente no mesmo horário',
          );
        }

        // Verificar conflito de profissional (exceto o próprio registro)
        const conflitoProfissional = await this.agendaRepository.findOne({
          where: {
            profissionalUuid,
            dataConsulta,
            horarioInicio,
            uuid: { $ne: uuid } as any,
          },
        });

        if (conflitoProfissional) {
          throw new ConflictException(
            'Já existe um agendamento para este profissional no mesmo horário',
          );
        }
      }
    }

    // Recalcular saldo se valores financeiros foram alterados
    let saldo = agenda.saldo;
    if (
      updateAgendaDto.subtotal !== undefined ||
      updateAgendaDto.desconto !== undefined ||
      updateAgendaDto.recebido !== undefined
    ) {
      const subtotal = updateAgendaDto.subtotal ?? agenda.subtotal;
      const desconto = updateAgendaDto.desconto ?? agenda.desconto;
      const recebido = updateAgendaDto.recebido ?? agenda.recebido;
      saldo = subtotal - desconto - recebido;
    }

    await this.agendaRepository.update(uuid, {
      ...updateAgendaDto,
      dataConsulta: updateAgendaDto.dataConsulta
        ? new Date(updateAgendaDto.dataConsulta)
        : undefined,
      saldo,
    });

    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    await this.findOne(uuid); // Verificar se existe
    return this.agendaRepository.softDelete(uuid);
  }

  // Estatísticas
  async getStatisticsByTenancy(
    tenancyUuid: string,
    month?: number,
    year?: number,
  ) {
    const query = this.agendaRepository
      .createQueryBuilder('agenda')
      .where('agenda.tenancyUuid = :tenancyUuid', { tenancyUuid });

    if (month && year) {
      query.andWhere('EXTRACT(MONTH FROM agenda.dataConsulta) = :month', {
        month,
      });
      query.andWhere('EXTRACT(YEAR FROM agenda.dataConsulta) = :year', {
        year,
      });
    }

    const [total, totalValor] = await Promise.all([
      query.getCount(),
      query.select('SUM(agenda.subtotal)', 'total').getRawOne(),
    ]);

    return {
      totalAgendamentos: total,
      valorTotal: parseFloat(totalValor.total) || 0,
    };
  }

  // Verificar disponibilidade de horário
  async checkAvailability(
    profissionalUuid: string,
    dataConsulta: string,
    horarioInicio: string,
    horarioFim?: string,
  ) {
    const conflitos = await this.agendaRepository.find({
      where: {
        profissionalUuid,
        dataConsulta: new Date(dataConsulta),
      },
    });

    const horarioInicioMinutos = this.timeToMinutes(horarioInicio);
    const horarioFimMinutos = horarioFim
      ? this.timeToMinutes(horarioFim)
      : horarioInicioMinutos + 30; // Assumir 30 min se não informado

    const temConflito = conflitos.some(agenda => {
      const agendaInicioMinutos = this.timeToMinutes(agenda.horarioInicio);
      const agendaFimMinutos = agenda.horarioFim
        ? this.timeToMinutes(agenda.horarioFim)
        : agendaInicioMinutos + 30;

      return (
        (horarioInicioMinutos >= agendaInicioMinutos &&
          horarioInicioMinutos < agendaFimMinutos) ||
        (horarioFimMinutos > agendaInicioMinutos &&
          horarioFimMinutos <= agendaFimMinutos) ||
        (horarioInicioMinutos <= agendaInicioMinutos &&
          horarioFimMinutos >= agendaFimMinutos)
      );
    });

    return { available: !temConflito, conflitos };
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async addProcedimentoToAgenda(
    agendaUuid: string,
    addProcedimentoDto: AddProcedimentoToAgendaDto,
  ): Promise<AgendaProcedimentoTenancy> {
    // Verificar se a agenda existe
    const agenda = await this.agendaRepository.findOne({
      where: { uuid: agendaUuid },
    });

    if (!agenda) {
      throw new NotFoundException(
        `Agenda com UUID ${agendaUuid} não encontrada`,
      );
    }

    // Verificar se já existe o relacionamento
    const existingRelation = await this.agendaProcedimentoRepository.findOne({
      where: {
        agendaUuid,
        procedimentoUuid: addProcedimentoDto.procedimentoUuid,
        tenancyUuid: addProcedimentoDto.tenancyUuid,
      },
    });

    if (existingRelation) {
      throw new ConflictException(
        'Procedimento já está associado a esta agenda',
      );
    }

    // Criar novo relacionamento
    const agendaProcedimento = this.agendaProcedimentoRepository.create({
      agendaUuid,
      procedimentoUuid: addProcedimentoDto.procedimentoUuid,
      tenancyUuid: addProcedimentoDto.tenancyUuid,
    });

    return await this.agendaProcedimentoRepository.save(agendaProcedimento);
  }

  async removeProcedimentoFromAgenda(
    agendaUuid: string,
    procedimentoUuid: string,
    tenancyUuid: string,
  ): Promise<void> {
    const result = await this.agendaProcedimentoRepository.delete({
      agendaUuid,
      procedimentoUuid,
      tenancyUuid,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        'Relacionamento entre agenda e procedimento não encontrado',
      );
    }
  }

  async findAgendaProcedimentos(
    agendaUuid: string,
  ): Promise<AgendaProcedimentoTenancy[]> {
    return await this.agendaProcedimentoRepository.find({
      where: { agendaUuid },
      relations: ['procedimento', 'agenda', 'tenancy'],
    });
  }

  async findAgendaWithProcedimentos(
    agendaUuid: string,
  ): Promise<AgendaWithProcedimentos> {
    const agenda = await this.agendaRepository.findOne({
      where: { uuid: agendaUuid },
    });

    if (!agenda) {
      throw new NotFoundException(
        `Agenda com UUID ${agendaUuid} não encontrada`,
      );
    }

    const agendaProcedimentos = await this.agendaProcedimentoRepository.find({
      where: { agendaUuid },
      relations: ['procedimento'],
    });

    const procedimentos = agendaProcedimentos.map(ap => ({
      uuid: ap.procedimento.uuid,
      nome: ap.procedimento.nome,
      valor: ap.procedimento.valor,
    }));

    return {
      uuid: agenda.uuid,
      tenancyUuid: agenda.tenancyUuid,
      pacienteUuid: agenda.pacienteUuid,
      profissionalUuid: agenda.profissionalUuid,
      dataConsulta: agenda.dataConsulta,
      horarioInicio: agenda.horarioInicio,
      horarioFim: agenda.horarioFim,
      procedimentos,
    };
  }
}
