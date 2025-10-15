import { User as PrismaUser, $Enums } from '@prisma/client';

// Re-exportar os tipos do Prisma
export type UserRole = $Enums.UserRole;
export const UserRole = $Enums.UserRole;
export type User = PrismaUser;

export class UserEntity implements PrismaUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: $Enums.UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<PrismaUser>) {
    Object.assign(this, partial);
  }

  // Método para excluir a senha ao retornar o usuário
  toSafeObject(): Omit<PrismaUser, 'password'> {
    const { password, ...result } = this;
    return result;
  }
}
