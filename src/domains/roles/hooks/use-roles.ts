'use client';

import { useQueryClient } from '@tanstack/react-query';

import {
  getGetAdminPermissionsQueryKey,
  useGetAdminPermissions
} from '@/services/-admin-permissions-get';
import { useDeleteAdminRolesId } from '@/services/-admin-roles-{id}-delete';
import { getGetAdminRolesIdQueryKey, useGetAdminRolesId } from '@/services/-admin-roles-{id}-get';
import { usePutAdminRolesIdPermissions } from '@/services/-admin-roles-{id}-permissions-put';
import { usePutAdminRolesId } from '@/services/-admin-roles-{id}-put';
import type { DtoUpdateRoleRequest } from '@/services/-admin-roles-{id}-put.schemas';
import { getGetAdminRolesQueryKey, useGetAdminRoles } from '@/services/-admin-roles-get';
import { usePostAdminRoles } from '@/services/-admin-roles-post';
import type { DtoCreateRoleRequest } from '@/services/-admin-roles-post.schemas';

export function useRoles() {
  return useGetAdminRoles({
    query: {
      select: (response) => response.data ?? []
    }
  });
}

export function useRole(id: number | null) {
  return useGetAdminRolesId(id ?? 0, {
    query: {
      enabled: id != null,
      select: (response) => response.data ?? null
    }
  });
}

export function usePermissions() {
  return useGetAdminPermissions({
    query: {
      select: (response) => response.data ?? []
    }
  });
}

export function useRoleMutations() {
  const queryClient = useQueryClient();
  const createMutation = usePostAdminRoles();
  const updateMutation = usePutAdminRolesId();
  const deleteMutation = useDeleteAdminRolesId();
  const permissionsMutation = usePutAdminRolesIdPermissions();

  const invalidate = async (roleId?: number) => {
    await queryClient.invalidateQueries({ queryKey: getGetAdminRolesQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getGetAdminPermissionsQueryKey() });
    if (roleId) {
      await queryClient.invalidateQueries({ queryKey: getGetAdminRolesIdQueryKey(roleId) });
    }
  };

  const createMutationWithInvalidation = {
    ...createMutation,
    mutateAsync: async (data: DtoCreateRoleRequest) => {
      const result = await createMutation.mutateAsync({ data });
      await invalidate();
      return result;
    }
  };

  const updateMutationWithInvalidation = {
    ...updateMutation,
    mutateAsync: async (variables: { id: number; data: DtoUpdateRoleRequest }) => {
      const result = await updateMutation.mutateAsync(variables);
      await invalidate(variables.id);
      return result;
    }
  };

  const deleteMutationWithInvalidation = {
    ...deleteMutation,
    mutateAsync: async (id: number) => {
      const result = await deleteMutation.mutateAsync({ id });
      await invalidate();
      return result;
    }
  };

  const permissionsMutationWithInvalidation = {
    ...permissionsMutation,
    mutateAsync: async (variables: { id: number; permissionIds: number[] }) => {
      const result = await permissionsMutation.mutateAsync({
        id: variables.id,
        data: { permission_ids: variables.permissionIds }
      });
      await invalidate(variables.id);
      return result;
    }
  };

  return {
    createRole: createMutationWithInvalidation.mutateAsync,
    updateRole: updateMutationWithInvalidation.mutateAsync,
    deleteRole: deleteMutationWithInvalidation.mutateAsync,
    setRolePermissions: permissionsMutationWithInvalidation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSavingPermissions: permissionsMutation.isPending
  };
}
