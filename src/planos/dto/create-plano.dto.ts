import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreatePlanoDto {
  @IsString()
  @Length(1, 255)
  nome: string;

  @IsOptional()
  @IsString()
  @Length(1, 4)
  totalEquipamento?: string = '20';

  @IsOptional()
  @IsBoolean()
  integracaoWhatsapp?: boolean = false;

  @IsOptional()
  @IsBoolean()
  integracaoSms?: boolean = false;

  @IsOptional()
  @IsBoolean()
  integracaoEmail?: boolean = false;

  @IsOptional()
  @IsBoolean()
  integracaoApi?: boolean = true;

  @IsOptional()
  @IsBoolean()
  habilitaCliente?: boolean = false;

  @IsOptional()
  @IsBoolean()
  habilitaProduto?: boolean = false;

  @IsOptional()
  @IsBoolean()
  habilitaBotox?: boolean = false;

  @IsOptional()
  @IsBoolean()
  habilitaLaudo?: boolean = false;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  custoSms?: number = 0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor?: number = 0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorPromo?: number = 0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorSetor?: number = 0;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorValorProfissional?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  somaDias?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  bonusDias?: number = 0;
}
