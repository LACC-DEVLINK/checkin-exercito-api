export enum Permission {
  // Usuários
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE_ROLES = 'users:manage-roles',
  
  // Check-in
  CHECKIN_CREATE = 'checkin:create',
  CHECKIN_READ = 'checkin:read',
  CHECKIN_UPDATE = 'checkin:update',
  CHECKIN_DELETE = 'checkin:delete',
  
  // QR Codes
  QRCODE_GENERATE = 'qrcode:generate',
  QRCODE_READ = 'qrcode:read',
  QRCODE_DELETE = 'qrcode:delete',
  
  // Relatórios
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',
}
