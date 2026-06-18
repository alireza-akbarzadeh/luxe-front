'use client';

import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions, useRole, useRoleMutations } from '@/domains/roles/hooks/use-roles';
import { useRolesStore } from '@/domains/roles/stores/roles-store';
import { cn } from '@/lib/utils';

export function RolePermissionsPanel() {
  const { selectedRoleId } = useRolesStore();
  const { data: role, isLoading: isRoleLoading } = useRole(selectedRoleId);
  const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissions();
  const { setRolePermissions, isSavingPermissions } = useRoleMutations();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedIds(role?.permission_ids ?? []);
  }, [role?.permission_ids, selectedRoleId]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof permissions>();
    for (const permission of permissions) {
      const list = map.get(permission.module) ?? [];
      list.push(permission);
      map.set(permission.module, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  const togglePermission = (id: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)
    );
  };

  const toggleModule = (modulePermissions: typeof permissions, checked: boolean) => {
    const ids = modulePermissions.map((item) => item.id);
    setSelectedIds((current) => {
      if (checked) return [...new Set([...current, ...ids])];
      return current.filter((id) => !ids.includes(id));
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    try {
      await setRolePermissions({ id: selectedRoleId, permissionIds: selectedIds });
      toast.success('Permissions updated');
    } catch {
      toast.error('Failed to save permissions');
    }
  };

  if (!selectedRoleId) {
    return (
      <div className='border-border/60 flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed p-8 text-center'>
        <p className='text-muted-foreground text-sm'>Select a role to manage permissions.</p>
      </div>
    );
  }

  if (isRoleLoading || isPermissionsLoading) {
    return (
      <div className='space-y-3 p-4'>
        <Skeleton className='h-10 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    );
  }

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='border-border/60 flex items-start justify-between gap-4 border-b px-4 py-4'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-base font-bold'>{role?.name}</h3>
            <Badge variant='secondary' className='text-[10px] uppercase'>
              {role?.slug}
            </Badge>
          </div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {selectedIds.length} of {permissions.length} permissions selected
          </p>
        </div>
        <Button
          size='sm'
          className='h-9 gap-2 rounded-xl'
          disabled={isSavingPermissions}
          onClick={() => void handleSave()}
        >
          <IconDeviceFloppy className='h-4 w-4' />
          Save permissions
        </Button>
      </div>

      <ScrollArea className='flex-1 p-4'>
        <div className='space-y-5'>
          {grouped.map(([module, modulePermissions]) => {
            const moduleIds = modulePermissions.map((item) => item.id);
            const allSelected = moduleIds.every((id) => selectedIds.includes(id));
            const someSelected = moduleIds.some((id) => selectedIds.includes(id));

            return (
              <section key={module} className='border-border/60 rounded-2xl border p-4'>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm font-bold capitalize'>{module}</p>
                    <p className='text-muted-foreground text-[11px]'>
                      {modulePermissions.length} permission
                      {modulePermissions.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <label className='flex items-center gap-2 text-xs font-medium'>
                    <Checkbox
                      checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                      onCheckedChange={(checked) =>
                        toggleModule(modulePermissions, checked === true)
                      }
                    />
                    Select all
                  </label>
                </div>

                <div className='space-y-2'>
                  {modulePermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className={cn(
                        'hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors',
                        selectedIds.includes(permission.id) && 'bg-primary/5 border-primary/20'
                      )}
                    >
                      <Checkbox
                        checked={selectedIds.includes(permission.id)}
                        onCheckedChange={(checked) =>
                          togglePermission(permission.id, checked === true)
                        }
                        className='mt-0.5'
                      />
                      <div className='min-w-0'>
                        <p className='text-sm font-medium'>{permission.key}</p>
                        {permission.description ? (
                          <p className='text-muted-foreground text-xs'>{permission.description}</p>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
