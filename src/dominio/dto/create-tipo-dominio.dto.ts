import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoDominioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  nome: string;
}
