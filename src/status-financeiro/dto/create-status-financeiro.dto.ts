import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateStatusFinanceiroDto {
  @IsString()
  @MaxLength(128)
  tag: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  cor?: string = '#000000';

  @IsOptional()
  @IsString()
  @MaxLength(3)
  menosDias?: string = '0';

  @IsOptional()
  @IsString()
  @MaxLength(3)
  maisDias?: string = '0';
}
