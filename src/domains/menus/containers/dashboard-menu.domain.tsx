'use client';

import { IconLayoutSidebar, IconRotateClockwise2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { DashboardMenuManager } from '@/domains/menus/components/dashboard-menu-manager';
import { useMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import {
  getGetAdminMenuGroupsQueryKey,
  useGetAdminMenuGroups
} from '@/services/-admin-menu-groups-get';
import { getGetAdminMenuItemsQueryKey } from '@/services/-admin-menu-items-get';

export function DashboardMenuDomain() {
  const queryClient = useQueryClient();
  const { selectGroup, reset } = useMenuManagerStore();
  const { data: groupsResponse } = useGetAdminMenuGroups();

  useEffect(() => {
    const groups = groupsResponse?.data ?? [];
    const current = useMenuManagerStore.getState().selectedGroupId;
    if (!current && groups[0]?.id) {
      selectGroup(groups[0].id);
    }
    return () => reset();
  }, [groupsResponse?.data, selectGroup, reset]);

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminMenuGroupsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminMenuItemsQueryKey() });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconLayoutSidebar className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Dashboard Menu</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Groups · Items · Permissions
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
              onClick={handleRefresh}
            >
              <IconRotateClockwise2 className='h-3.5 w-3.5' /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 px-6 py-8'>
        <DashboardMenuManager />
      </div>
    </div>
  );
}
