import type { CompanyRole } from "@/types";

export type Permission =
  | "company:read"
  | "company:update"
  | "company:delete"
  | "billing:manage"
  | "members:invite"
  | "members:update-role"
  | "assets:manage"
  | "obligations:manage"
  | "documents:manage"
  | "documents:read"
  | "reports:read";

const roleRank: Record<CompanyRole, number> = {
  viewer: 0,
  member: 1,
  manager: 2,
  admin: 3,
  owner: 4
};

const permissionMinimumRole: Record<Permission, CompanyRole> = {
  "company:read": "viewer",
  "company:update": "admin",
  "company:delete": "owner",
  "billing:manage": "owner",
  "members:invite": "admin",
  "members:update-role": "admin",
  "assets:manage": "manager",
  "obligations:manage": "manager",
  "documents:manage": "manager",
  "documents:read": "viewer",
  "reports:read": "viewer"
};

export function roleAtLeast(role: CompanyRole, requiredRole: CompanyRole) {
  return roleRank[role] >= roleRank[requiredRole];
}

export function roleCan(role: CompanyRole, permission: Permission) {
  return roleAtLeast(role, permissionMinimumRole[permission]);
}

export function assertSameCompany(input: { requestedCompanyId: string; resourceCompanyId: string }) {
  if (input.requestedCompanyId !== input.resourceCompanyId) {
    throw new Error("El recurso no pertenece a la empresa activa.");
  }
}

export function assertRoleCan(role: CompanyRole, permission: Permission) {
  if (!roleCan(role, permission)) {
    throw new Error("No tienes permisos suficientes para esta accion.");
  }
}
