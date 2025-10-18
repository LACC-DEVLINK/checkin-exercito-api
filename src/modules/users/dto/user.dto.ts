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

const VALIDATION_MESSAGES = {
  REQUIRED: {
    NAME: 'Nome é obrigatório',
    EMAIL: 'Email é obrigatório', 
    PASSWORD: 'Senha é obrigatória',
  },
  FORMAT: {
    STRING: 'deve ser uma string',
    EMAIL: 'Email deve ser válido',
    BOOLEAN: 'deve ser um booleano',
    ROLE: 'Role deve ser ADMIN, OPERATOR ou SUPERVISOR',
  },
  LENGTH: {
    NAME_MIN: 'Nome deve ter pelo menos 2 caracteres',
    NAME_MAX: 'Nome deve ter no máximo 100 caracteres',
    PASSWORD_MIN: 'Senha deve ter pelo menos 6 caracteres',
    PASSWORD_MAX: 'Senha deve ter no máximo 100 caracteres',
  },
} as const;

export class CreateUserDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @IsString({ message: `Nome ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.NAME_MAX })
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.EMAIL })
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exercito.mil.br',
    format: 'email',
  })
  email: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.PASSWORD })
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(6, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MAX })
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
  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.FORMAT.ROLE })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Se o usuário está ativo no sistema',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: `isActive ${VALIDATION_MESSAGES.FORMAT.BOOLEAN}` })
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
  @IsString({ message: `Nome ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.NAME_MAX })
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exercito.mil.br',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(6, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MAX })
  password?: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.OPERATOR,
    default: UserRole.OPERATOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.FORMAT.ROLE })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Se o usuário está ativo no sistema',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: `isActive ${VALIDATION_MESSAGES.FORMAT.BOOLEAN}` })
  isActive?: boolean;
}
export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para login',
    example: 'admin@exercito.mil.br',
    format: 'email',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.EMAIL })
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário para login',
    example: 'minhasenha123',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.PASSWORD })
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  password: string;
}

// DTO de resposta (sem senha)
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1234567890,
  })
  id: number;

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
