'use client';

import { IconPlus, IconRotateClockwise2, IconShieldLock } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { RoleFormDialog } from '@/domains/roles/components/role-form-dialog';
import { RoleList } from '@/domains/roles/components/role-list';
import { RolePermissionsPanel } from '@/domains/roles/components/role-permissions-panel';
import { PERMISSIONS_QUERY_KEY, ROLES_QUERY_KEY, useRoles } from '@/domains/roles/hooks/use-roles';
import { useRolesStore } from '@/domains/roles/stores/roles-store';

export function RolesDomain() {
  const queryClient = useQueryClient();
  const { openCreateDialog } = useRolesStore();
  const { data: roles = [], isLoading, isError, refetch } = useRoles();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconShieldLock className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Roles & Permissions</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Access control
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
                onClick={handleRefresh}
              >
                <IconRotateClockwise2 className='h-3.5 w-3.5' /> Refresh
              </Button>
              <Button
                size='sm'
                className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
                onClick={openCreateDialog}
              >
                <IconPlus className='h-3.5 w-3.5' /> New role
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 px-6 py-8'>
        {isError ? (
          <div className='border-border/60 rounded-2xl border p-10 text-center'>
            <p className='text-destructive font-medium'>Failed to load roles.</p>
            <Button variant='outline' className='mt-4 rounded-xl' onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className='grid min-h-[640px] gap-4 lg:grid-cols-[320px_1fr]'>
            <aside className='border-border/60 bg-card/40 rounded-2xl border p-3'>
              <div className='mb-3 px-1'>
                <h2 className='text-sm font-bold'>Roles</h2>
                <p className='text-muted-foreground text-[11px]'>
                  User accounts use the role slug (`admin`, `user`, `moderator`).
                </p>
              </div>
              <RoleList roles={roles} isLoading={isLoading} />
            </aside>

            <section className='border-border/60 bg-card/40 overflow-hidden rounded-2xl border'>
              <RolePermissionsPanel />
            </section>
          </div>
        )}
      </div>

      <RoleFormDialog />
    </div>
  );
}
