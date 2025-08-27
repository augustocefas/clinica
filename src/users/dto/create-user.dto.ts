import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name deve ser uma string' })
  @MaxLength(255, { message: 'name deve ter no máximo 255 caracteres' })
  name: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  @MaxLength(255, { message: 'email deve ter no máximo 255 caracteres' })
  email: string;

  @IsString({ message: 'password deve ser uma string' })
  @MinLength(6, { message: 'password deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'password deve ter no máximo 255 caracteres' })
  password: string;

  @IsOptional()
  @IsArray({ message: 'tenancyUuids deve ser um array' })
  @IsUUID('4', {
    each: true,
    message: 'Cada tenancyUuid deve ser um UUID válido',
  })
  tenancyUuids?: string[];
}
