import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;
}
