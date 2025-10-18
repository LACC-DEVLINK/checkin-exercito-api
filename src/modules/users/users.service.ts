import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UserRole } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  LoginDto,
} from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly saltRounds = 12;

  // Campos de seleção sem senha
  private readonly userSelectFields = {
    id: true,
    email: true,
    name: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  } as const;

  /**
   * Criar novo usuário
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || UserRole.OPERATOR,
        isActive: createUserDto.isActive ?? true,
      },
      select: this.userSelectFields,
    });

    return user as UserResponseDto;
  }

  /**
   * Listar todos os usuários ativos
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: this.userSelectFields,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users as UserResponseDto[];
  }

  /**
   * Buscar usuário por ID
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: this.userSelectFields,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user as UserResponseDto;
  }

  /**
   * Buscar usuário por email (para autenticação)
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user ? new UserEntity(user) : null;
  }

  /**
   * Validar credenciais de login
   */
  async validateUser(loginDto: LoginDto): Promise<UserResponseDto | null> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      throw new BadRequestException('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Credenciais inválidas');
    }

    return user.toSafeObject() as UserResponseDto;
  }

  /**
   * Atualizar usuário
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // mudou de string para number
    // Verificar se o usuário existe
    await this.findOne(id);

    // Preparar dados para atualização
    const updateData: any = {};

    if (updateUserDto.name !== undefined) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.email !== undefined) {
      // Verificar se o email já está em uso por outro usuário
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }

      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltRounds,
      );
    }

    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    if (updateUserDto.isActive !== undefined) {
      updateData.isActive = updateUserDto.isActive;
    }

    // Atualizar usuário
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.userSelectFields,
    });

    return user as UserResponseDto;
  }

  /**
   * Soft delete de usuário
   */
  async remove(id: number): Promise<void> {
    // ✅ mudou de string para number
    // Verificar se o usuário existe
    await this.findOne(id);

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  /**
   * Restaurar usuário deletado
   */
  async restore(id: number): Promise<UserResponseDto> {
    // mudou de string para number
    // Verificar se o usuário existe (incluindo os deletados)
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.deletedAt) {
      throw new ConflictException('Usuário não está excluído');
    }

    const restoredUser = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
      select: this.userSelectFields,
    });

    return restoredUser as UserResponseDto;
  }

  /**
   * Ativar/desativar usuário
   */
  async toggleActive(id: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
      select: this.userSelectFields,
    });

    return updatedUser as UserResponseDto;
  }

  /**
   * Buscar usuários por role
   */
  async findByRole(role: UserRole): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role,
        deletedAt: null,
      },
      select: this.userSelectFields,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users as UserResponseDto[];
  }

  /**
   * Alterar senha
   */
  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  async hasRole(userId: number, role: UserRole): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === role;
  }

  async isAdmin(userId: number): Promise<boolean> {
    return this.hasRole(userId, UserRole.ADMIN);
  }

  async isSupervisorOrAdmin(userId: number): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === UserRole.ADMIN || user.role === UserRole.SUPERVISOR;
  }

  /**
   * Estatísticas de usuários
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deleted: number;
    byRole: Record<string, number>;
  }> {
    const [total, active, inactive, deleted, roleStats] = await Promise.all([
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
      this.prisma.user.count({
        where: { isActive: true, deletedAt: null },
      }),
      this.prisma.user.count({
        where: { isActive: false, deletedAt: null },
      }),
      this.prisma.user.count({
        where: { deletedAt: { not: null } },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        where: { deletedAt: null },
        _count: {
          role: true,
        },
      }),
    ]);

    const byRole: Record<string, number> = {};
    roleStats.forEach((stat) => {
      byRole[stat.role] = stat._count.role;
    });

    return {
      total,
      active,
      inactive,
      deleted,
      byRole,
    };
  }
}
