import { Injectable } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

type UserRoleType = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR';

@Injectable()
export class PermissionsService {
  private readonly rolePermissions: Record<UserRoleType, Permission[]> = {
    'ADMIN': [
      // ADMIN tem todas as permissões
      Permission.USERS_CREATE,
      Permission.USERS_READ,
      Permission.USERS_UPDATE,
      Permission.USERS_DELETE,
      Permission.USERS_MANAGE_ROLES,
      Permission.CHECKIN_CREATE,
      Permission.CHECKIN_READ,
      Permission.CHECKIN_UPDATE,
      Permission.CHECKIN_DELETE,
      Permission.QRCODE_GENERATE,
      Permission.QRCODE_READ,
      Permission.QRCODE_DELETE,
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
    ],
    'SUPERVISOR': [
      // SUPERVISOR pode gerenciar operadores e check-ins
      Permission.USERS_READ,
      Permission.USERS_UPDATE,
      Permission.CHECKIN_CREATE,
      Permission.CHECKIN_READ,
      Permission.CHECKIN_UPDATE,
      Permission.CHECKIN_DELETE,
      Permission.QRCODE_GENERATE,
      Permission.QRCODE_READ,
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
    ],
    'OPERATOR': [
      // OPERATOR só pode fazer check-in e ver QR codes
      Permission.CHECKIN_CREATE,
      Permission.CHECKIN_READ,
      Permission.QRCODE_READ,
      Permission.REPORTS_VIEW,
    ],
  };

  hasPermission(role: string, permission: Permission): boolean {
    return this.rolePermissions[role as UserRoleType]?.includes(permission) ?? false;
  }

  hasAnyPermission(role: string, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(role, permission));
  }

  hasAllPermissions(role: string, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(role, permission));
  }

  getPermissions(role: string): Permission[] {
    return this.rolePermissions[role as UserRoleType] ?? [];
  }

  canManageUser(userRole: string, targetRole: string): boolean {
    // ADMIN pode gerenciar qualquer um
    if (userRole === 'ADMIN') {
      return true;
    }

    // SUPERVISOR pode gerenciar apenas OPERATOR
    if (userRole === 'SUPERVISOR' && targetRole === 'OPERATOR') {
      return true;
    }

    return false;
  }

  getRoleHierarchy(): Record<UserRoleType, number> {
    return {
      'ADMIN': 3,
      'SUPERVISOR': 2,
      'OPERATOR': 1,
    };
  }

  isHigherRole(role1: string, role2: string): boolean {
    const hierarchy = this.getRoleHierarchy();
    return hierarchy[role1 as UserRoleType] > hierarchy[role2 as UserRoleType];
  }
}
