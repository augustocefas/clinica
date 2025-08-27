import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateDominioDto {
  @IsNumber()
  @IsNotEmpty()
  tipoDominioId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(6)
  cor?: string;
}
