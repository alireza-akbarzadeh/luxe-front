'use client';

import { useMemo } from 'react';

import { useGetAdminRoles } from '@/services/-admin-roles-get';

/** Role slug → display label for admin tables and sheets. */
export function useRoleLabelMap() {
  const { data: response } = useGetAdminRoles();
  const roles = response?.data ?? [];

  return useMemo(() => {
    const map = new Map<string, string>();
    for (const role of roles) {
      if (role.slug) map.set(role.slug, role.name ?? role.slug);
    }
    return map;
  }, [roles]);
}

/** Select options built from the roles API. */
export function useRoleSelectOptions() {
  const { data: response, isLoading } = useGetAdminRoles();
  const roles = response?.data ?? [];

  const options = useMemo(
    () =>
      [...roles]
        .filter((role) => role.slug)
        .sort((a, b) => (a.name ?? a.slug ?? '').localeCompare(b.name ?? b.slug ?? ''))
        .map((role) => ({
          label: role.name ?? role.slug ?? '',
          value: role.slug ?? ''
        })),
    [roles]
  );

  return { options, isLoading };
}
