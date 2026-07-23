import api from "./api";

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

export interface Resource {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  roleId: string;
  resourceId: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  resource: Resource;
}

export async function getRoles(): Promise<Role[]> {
  const res = await api.get("/v1/rbac/roles");
  return res.data;
}

export async function getResources(): Promise<Resource[]> {
  const res = await api.get("/v1/rbac/resources");
  return res.data;
}

export async function createRole(name: string, description?: string): Promise<Role> {
  const res = await api.post("/v1/rbac/roles", { name, description });
  return res.data;
}

export async function assignPermission(
  roleId: string,
  resourceId: string,
  perms: { canRead?: boolean; canWrite?: boolean; canDelete?: boolean },
): Promise<void> {
  await api.post("/v1/rbac/permissions", { roleId, resourceId, ...perms });
}
