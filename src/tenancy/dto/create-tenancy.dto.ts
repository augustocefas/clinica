import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateTenancyDto {
  @IsNumber()
  segmentoId: number;

  @IsBoolean()
  @IsOptional()
  prepago?: boolean = true;

  @IsString()
  slug: string;

  @IsNumber()
  @IsOptional()
  planoId?: number;
}
