'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createRole,
  deleteRole,
  fetchPermissions,
  fetchRole,
  fetchRoles,
  setRolePermissions,
  updateRole
} from '@/domains/roles/api/roles-api';

export const ROLES_QUERY_KEY = ['admin', 'roles'] as const;
export const PERMISSIONS_QUERY_KEY = ['admin', 'permissions'] as const;

export function getRoleQueryKey(id: number) {
  return [...ROLES_QUERY_KEY, id] as const;
}

export function useRoles() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchRoles();
      return response.data ?? [];
    }
  });
}

export function useRole(id: number | null) {
  return useQuery({
    queryKey: getRoleQueryKey(id ?? 0),
    queryFn: async () => {
      if (!id) return null;
      const response = await fetchRole(id);
      return response.data ?? null;
    },
    enabled: id != null
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchPermissions();
      return response.data ?? [];
    }
  });
}

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const invalidate = async (roleId?: number) => {
    await queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    if (roleId) {
      await queryClient.invalidateQueries({ queryKey: getRoleQueryKey(roleId) });
    }
  };

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => void invalidate()
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string } }) =>
      updateRole(id, data),
    onSuccess: (_, variables) => void invalidate(variables.id)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => void invalidate()
  });

  const permissionsMutation = useMutation({
    mutationFn: ({ id, permissionIds }: { id: number; permissionIds: number[] }) =>
      setRolePermissions(id, permissionIds),
    onSuccess: (_, variables) => void invalidate(variables.id)
  });

  return {
    createRole: createMutation.mutateAsync,
    updateRole: updateMutation.mutateAsync,
    deleteRole: deleteMutation.mutateAsync,
    setRolePermissions: permissionsMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSavingPermissions: permissionsMutation.isPending
  };
}
