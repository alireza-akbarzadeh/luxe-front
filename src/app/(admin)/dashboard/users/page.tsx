'use client';

import { IconDownload } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  const { data } = useGetUsers();
  const stats = data?.data?.data?.users || {
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    newUsersThisMonth: 0
  };

  const handleExport = () => {
    toast.promise(new Promise((res) => setTimeout(res, 1500)), {
      loading: 'Preparing CSV export...',
      success: 'User directory exported successfully',
      error: 'Export failed'
    });
  };

  return (
    <div className='relative min-h-screen space-y-6 p-4 md:p-8'>
      {/* 1. Page Header */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-black tracking-tight uppercase italic'>User Directory</h1>
          <p className='text-muted-foreground text-sm font-medium'>
            Manage, verify, and monitor your global user base.
          </p>
        </div>

        <div className='flex items-center gap-2 overflow-x-auto'>
          <Button
            variant='outline'
            onClick={handleExport}
            className='border-border/60 h-10 rounded-xl text-[10px] font-bold tracking-wider uppercase'
          >
            <IconDownload className='mr-2 h-3.5 w-3.5' /> Export
          </Button>

          <AppDialog
            open={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            component='drawer'
            title='Invite New Member'
            description='Send an invitation link to a new user to join your organization.'
            trigger={
              <Button
                variant='outline'
                className={cn(
                  'h-10 rounded-xl px-6',
                  'bg-background/50 border-border/60 text-[10px] font-black tracking-[0.15em] uppercase backdrop-blur-md',
                  'hover:bg-muted/50 hover:border-primary/50 hover:text-primary',
                  'group shadow-sm transition-all duration-300'
                )}
              >
                <Plus className='mr-2 h-3.5 w-3.5 transition-transform group-hover:rotate-90' />
                Invite User
              </Button>
            }
          >
            <InviteUserForm
              onSuccess={() => {
                setIsInviteOpen(false);
              }}
            />
          </AppDialog>

          <Button
            asChild
            className={cn(
              'h-10 rounded-xl px-6',
              'bg-primary text-primary-foreground text-[10px] font-black tracking-[0.15em] uppercase',
              'shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_-3px_rgba(var(--primary),0.5)]',
              'border-t border-white/20 transition-all duration-300 active:scale-95 active:shadow-inner'
            )}
          >
            <Link to='/dashboard/users/create'>
              <Plus className='mr-2 h-3.5 w-3.5 stroke-[3px]' />
              Create User
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Quick Summary Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
        <UserStatCard label='Total Users' value={stats.totalUsers.toLocaleString()} change='+12%' />
        <UserStatCard label='Active Users' value={stats.activeUsers.toLocaleString()} pulse />
        <UserStatCard
          label='Premium Users'
          value={stats.premiumUsers.toLocaleString()}
          color='text-emerald-500'
        />
        <UserStatCard
          label='New This Month'
          value={stats.newUsersThisMonth.toLocaleString()}
          color='text-blue-500'
        />
      </div>

      {/* 3. The Main Table Area */}
      <div className='border-border/40 bg-card/30 overflow-hidden rounded-[2.5rem] border shadow-2xl shadow-black/5 backdrop-blur-xl'>
        <UserManagementTable />
      </div>
    </div>
  );
}
