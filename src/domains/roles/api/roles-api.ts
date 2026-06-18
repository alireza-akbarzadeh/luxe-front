import { customInstance } from '@/lib/api/api-client';

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_system: boolean;
  user_count: number;
  permission_count: number;
  permission_keys?: string[];
  permission_ids?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  key: string;
  module: string;
  description?: string;
}

interface ApiListResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export function fetchRoles() {
  return customInstance<ApiListResponse<Role[]>>({ url: '/admin/roles', method: 'GET' });
}

export function fetchRole(id: number) {
  return customInstance<ApiListResponse<Role>>({ url: `/admin/roles/${id}`, method: 'GET' });
}

export function fetchPermissions() {
  return customInstance<ApiListResponse<Permission[]>>({
    url: '/admin/permissions',
    method: 'GET'
  });
}

export function createRole(data: { name: string; slug: string; description?: string }) {
  return customInstance<ApiListResponse<Role>>({
    url: '/admin/roles',
    method: 'POST',
    data
  });
}

export function updateRole(id: number, data: { name: string; description?: string }) {
  return customInstance<ApiListResponse<Role>>({
    url: `/admin/roles/${id}`,
    method: 'PUT',
    data
  });
}

export function deleteRole(id: number) {
  return customInstance<ApiListResponse<null>>({
    url: `/admin/roles/${id}`,
    method: 'DELETE'
  });
}

export function setRolePermissions(id: number, permissionIds: number[]) {
  return customInstance<ApiListResponse<Role>>({
    url: `/admin/roles/${id}/permissions`,
    method: 'PUT',
    data: { permission_ids: permissionIds }
  });
}
