import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTipoDominioConfigDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  nome: string;
}
