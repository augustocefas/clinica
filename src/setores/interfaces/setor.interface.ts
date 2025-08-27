export interface ISetorWithProfissionais {
  uuid: string;
  tenancyUuid: string;
  nome: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  tenancy?: {
    uuid: string;
    nome: string;
  };
  setorProfissionais?: ISetorProfissionalTenancy[];
}

export interface ISetorProfissionalTenancy {
  profissionalUuid: string;
  setorUuid: string;
  tenancyUuid: string;
  createdAt: Date;
  updatedAt: Date;
  profissional?: {
    uuid: string;
    nome: string;
    email?: string;
  };
  setor?: {
    uuid: string;
    nome: string;
  };
  tenancy?: {
    uuid: string;
    nome: string;
  };
}

export interface ISetorFilterResponse {
  data: ISetorWithProfissionais[];
  total: number;
  limit: number;
  offset: number;
}

export interface ISetorStats {
  totalSetores: number;
  setoresAtivos: number;
  setoresInativos: number;
  totalProfissionaisAssociados: number;
}
