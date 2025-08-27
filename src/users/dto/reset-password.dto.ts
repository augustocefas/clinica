import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  @IsString({ message: 'token deve ser uma string' })
  @IsNotEmpty({ message: 'token é obrigatório' })
  token: string;

  @IsString({ message: 'newPassword deve ser uma string' })
  @MinLength(6, { message: 'newPassword deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'newPassword deve ter no máximo 255 caracteres' })
  @IsNotEmpty({ message: 'newPassword é obrigatório' })
  newPassword: string;
}
