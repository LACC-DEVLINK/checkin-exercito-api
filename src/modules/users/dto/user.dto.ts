import 'reflect-metadata';
import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsEnum, 
  MinLength, 
  MaxLength,
  IsNotEmpty,
  IsBoolean 
} from 'class-validator';
import { $Enums } from '@prisma/client';
import type { User } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum($Enums.UserRole, { message: 'Role deve ser ADMIN, OPERATOR ou SUPERVISOR' })
  role?: $Enums.UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum($Enums.UserRole, { message: 'Role deve ser ADMIN, OPERATOR ou SUPERVISOR' })
  role?: $Enums.UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;
}

// Usar o tipo do Prisma sem a senha
export type UserResponseDto = Omit<User, 'password'>;

