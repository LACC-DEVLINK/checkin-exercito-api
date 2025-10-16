import { UserRole } from '@prisma/client';

export class UserEntity {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  // Método para retornar usuário sem a senha
  toSafeObject(): Omit<UserEntity, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = this;
    return result as Omit<UserEntity, 'password'>;
  }

  // Método para verificar se o usuário está ativo
  isUserActive(): boolean {
    return this.isActive && !this.deletedAt;
  }

  // Método para verificar permissões
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  // Método para soft delete
  softDelete(): void {
    this.deletedAt = new Date();
    this.isActive = false;
  }

  // Método para restaurar
  restore(): void {
    this.deletedAt = null;
    this.isActive = true;
  }

  // Verificar se está deletado
  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
