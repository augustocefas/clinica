export interface AgendaProcedimentoRelation {
  agendaUuid: string;
  procedimentoUuid: string;
  tenancyUuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgendaWithProcedimentos {
  uuid: string;
  tenancyUuid: string;
  pacienteUuid: string;
  profissionalUuid: string;
  dataConsulta?: Date;
  horarioInicio?: string;
  horarioFim?: string;
  procedimentos: {
    uuid: string;
    nome: string;
    valor: number;
  }[];
}
