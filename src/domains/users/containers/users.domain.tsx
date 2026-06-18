'use client';

import { IconRotateClockwise2, IconUsers } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { UserManagementTable } from '@/domains/users/sections/user-table';
import { UsersKPICards } from '@/domains/users/sections/users-kpi-cards';
import {
  getGetAdminDashboardOverviewQueryKey,
  useGetAdminDashboardOverview
} from '@/services/-admin-dashboard-overview-get';
import { getGetAdminStatsQueryKey, useGetAdminStats } from '@/services/-admin-stats-get';
import { getGetAdminUsersQueryKey } from '@/services/-admin-users-get';

export function UsersDomain() {
  const queryClient = useQueryClient();
  const { data: statsResponse, isLoading: isStatsLoading } = useGetAdminStats();
  const { data: overviewResponse, isLoading: isOverviewLoading } = useGetAdminDashboardOverview({
    period: '30d'
  });

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
    void queryClient.invalidateQueries({
      queryKey: getGetAdminDashboardOverviewQueryKey({ period: '30d' })
    });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconUsers className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Users</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Account Management
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

      <div className='mx-auto max-w-400 space-y-8 px-6 py-8'>
        <UsersKPICards
          stats={statsResponse?.data}
          overview={overviewResponse?.data}
          isLoading={isStatsLoading || isOverviewLoading}
        />

        <div>
          <div className='mb-4'>
            <h2 className='text-base font-black tracking-tight'>All Users</h2>
            <p className='text-muted-foreground mt-0.5 text-[11px]'>
              Double-click a row for details. Use row actions → Change role to assign any role from
              Roles & Permissions.
            </p>
          </div>
          <div className='border-border/40 bg-card/30 rounded-[2.5rem] border shadow-2xl shadow-black/5 backdrop-blur-xl'>
            <UserManagementTable />
          </div>
        </div>
      </div>
    </div>
  );
}
