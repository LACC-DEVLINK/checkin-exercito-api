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
import { UserRole } from '@prisma/client';

// Constantes para mensagens de validação
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
  name: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.EMAIL })
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  email: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.PASSWORD })
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(6, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MAX })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.FORMAT.ROLE })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: `isActive ${VALIDATION_MESSAGES.FORMAT.BOOLEAN}` })
  isActive?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: `Nome ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.NAME_MAX })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  email?: string;

  @IsOptional()
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  @MinLength(6, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN })
  @MaxLength(100, { message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MAX })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: VALIDATION_MESSAGES.FORMAT.ROLE })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: `isActive ${VALIDATION_MESSAGES.FORMAT.BOOLEAN}` })
  isActive?: boolean;
}
export class LoginDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.EMAIL })
  @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL })
  email: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.PASSWORD })
  @IsString({ message: `Senha ${VALIDATION_MESSAGES.FORMAT.STRING}` })
  password: string;
}

// DTO de resposta (sem senha)
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
