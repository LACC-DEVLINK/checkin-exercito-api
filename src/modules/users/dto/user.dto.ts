import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '@prisma/client'; // ✅ Use esta importação
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exercito.mil.br',
    format: 'email',
  })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6,
    maxLength: 100,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.OPERATOR,
    default: UserRole.OPERATOR,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role deve ser ADMIN, OPERATOR ou SUPERVISOR',
  })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Se o usuário está ativo no sistema',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exercito.mil.br',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.OPERATOR,
    default: UserRole.OPERATOR,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role deve ser ADMIN, OPERATOR ou SUPERVISOR',
  })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Se o usuário está ativo no sistema',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;
}
export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para login',
    example: 'admin@exercito.mil.br',
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'minhasenha123',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;
}

// DTO de resposta (sem senha)
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exercito.mil.br',
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.OPERATOR,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-01-16T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-01-16T10:30:00.000Z',
  })
  updatedAt: Date;
}
