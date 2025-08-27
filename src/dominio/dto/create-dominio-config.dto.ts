import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateDominioConfigDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  tipoDominioConfigId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(6)
  cor?: string;
}
