import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { $Enums } from '@prisma/client';
import type { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || $Enums.UserRole.OPERATOR,
        isActive: createUserDto.isActive ?? true,
      },
    });

    // Retornar usuário sem a senha
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // Explicitamente excluir password
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users as UserResponseDto[];
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Verificar se o usuário existe
    await this.findOne(id);

    // Preparar dados para atualização
    const updateData: any = { ...updateUserDto };

    // Se a senha foi fornecida, fazer o hash
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    // Verificar se o email já está em uso por outro usuário
    if (updateUserDto.email) {
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
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  async remove(id: number): Promise<void> {
    // Verificar se o usuário existe
    await this.findOne(id);

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<UserResponseDto> {
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
      },
    });

    const { password, ...result } = restoredUser;
    return result as UserResponseDto;
  }

  // Métodos auxiliares para verificação de permissões
  async hasRole(userId: number, role: $Enums.UserRole): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === role;
  }

  async isAdmin(userId: number): Promise<boolean> {
    return this.hasRole(userId, $Enums.UserRole.ADMIN);
  }

  async isSupervisorOrAdmin(userId: number): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.role === $Enums.UserRole.ADMIN || user.role === $Enums.UserRole.SUPERVISOR;
  }

  // Método para buscar usuários por role
  async findByRole(role: $Enums.UserRole): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users as UserResponseDto[];
  }

  // Método para ativar/desativar usuário
  async toggleActive(id: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
    });

    const { password, ...result } = updatedUser;
    return result as UserResponseDto;
  }

  // Método para contar usuários por status
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