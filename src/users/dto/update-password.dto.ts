import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'currentPassword deve ser uma string' })
  currentPassword: string;

  @IsString({ message: 'newPassword deve ser uma string' })
  @MinLength(6, { message: 'newPassword deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'newPassword deve ter no máximo 255 caracteres' })
  newPassword: string;
}
