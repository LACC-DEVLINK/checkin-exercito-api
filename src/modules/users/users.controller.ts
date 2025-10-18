// Users Controller - TODO: CRUD de usuários
// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser, Permission, RequirePermissions, PermissionsGuard } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.USERS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  async findAll(@CurrentUser() user: any): Promise<UserResponseDto[]> {
    // Se for OPERATOR, pode ver apenas a si mesmo
    if (user.role === UserRole.OPERATOR) {
      const currentUser = await this.usersService.findOne(user.id);
      return [currentUser];
    }
    
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<UserResponseDto> {
    // OPERATOR só pode ver a si mesmo
    if (user.role === UserRole.OPERATOR && user.id !== id) {
      throw new ForbiddenException('Você só pode visualizar seu próprio perfil');
    }

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.USERS_UPDATE)
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ): Promise<UserResponseDto> {
    const targetUser = await this.usersService.findOne(id);

    // Verificar se pode atualizar
    const canUpdate = this.usersService.canUpdateUser(
      user.role,
      user.id,
      id,
      targetUser.role as UserRole,
    );

    if (!canUpdate) {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
    }

    // Se estiver tentando mudar a role, validar
    if (updateUserDto.role) {
      this.usersService.validateRoleChange(
        user.role,
        user.id,
        id,
        targetUser.role as UserRole,
        updateUserDto.role,
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.USERS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar usuário (apenas ADMIN)' })
  @ApiResponse({ status: 204, description: 'Usuário deletado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<void> {
    await this.usersService.validateDelete(user.role, user.id, id);
    return this.usersService.remove(id);
  }

  @Patch(':id/restore')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restaurar usuário deletado (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário restaurado' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.restore(id);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.USERS_MANAGE_ROLES)
  @ApiOperation({ summary: 'Alterar role do usuário (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Role alterada' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') newRole: UserRole,
    @CurrentUser() user: any,
  ): Promise<UserResponseDto> {
    const targetUser = await this.usersService.findOne(id);

    this.usersService.validateRoleChange(
      user.role,
      user.id,
      id,
      targetUser.role as UserRole,
      newRole,
    );

    return this.usersService.update(id, { role: newRole });
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  @ApiResponse({ status: 200, description: 'Status alterado' })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<UserResponseDto> {
    const targetUser = await this.usersService.findOne(id);

    // SUPERVISOR só pode gerenciar OPERATORS
    if (user.role === UserRole.SUPERVISOR && targetUser.role !== UserRole.OPERATOR) {
      throw new ForbiddenException('Supervisores só podem gerenciar operadores');
    }

    return this.usersService.toggleActive(id);
  }
}
