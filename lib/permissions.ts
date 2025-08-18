export const PERMISSIONS = {
  // Employee Management
  EMPLOYEE_READ: "EMPLOYEE_READ",
  EMPLOYEE_WRITE: "EMPLOYEE_WRITE",
  EMPLOYEE_DELETE: "EMPLOYEE_DELETE",

  // Department Management
  DEPARTMENT_READ: "DEPARTMENT_READ",
  DEPARTMENT_WRITE: "DEPARTMENT_WRITE",
  DEPARTMENT_DELETE: "DEPARTMENT_DELETE",

  // User Management
  USER_READ: "USER_READ",
  USER_WRITE: "USER_WRITE",
  USER_DELETE: "USER_DELETE",

  // System Administration
  SYSTEM_ADMIN: "SYSTEM_ADMIN",

  // Reporting
  REPORTS_READ: "REPORTS_READ",

  // Audit
  AUDIT_READ: "AUDIT_READ",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  EMPLOYEE: [PERMISSIONS.EMPLOYEE_READ],
  HR_STAFF: [PERMISSIONS.EMPLOYEE_READ, PERMISSIONS.EMPLOYEE_WRITE, PERMISSIONS.DEPARTMENT_READ, PERMISSIONS.USER_READ],
  HR_MANAGER: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_WRITE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.DEPARTMENT_WRITE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.REPORTS_READ,
  ],
  DEPARTMENT_MANAGER: [PERMISSIONS.EMPLOYEE_READ, PERMISSIONS.DEPARTMENT_READ, PERMISSIONS.REPORTS_READ],
  SYSTEM_ADMIN: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_WRITE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.DEPARTMENT_WRITE,
    PERMISSIONS.DEPARTMENT_DELETE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.AUDIT_READ,
  ],
  GUEST: [],
}

export function hasPermission(userRole: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

export function hasAnyPermission(userRole: string, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: string, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}
