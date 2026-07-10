'use client';

import { IconPlus, IconRotateClockwise2, IconUsersGroup } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { AddTeamMemberDialog } from '@/domains/teams/components/add-team-member-dialog';
import { TeamFormDialog } from '@/domains/teams/components/team-form-dialog';
import { TeamList } from '@/domains/teams/components/team-list';
import { TeamMembersPanel } from '@/domains/teams/components/team-members-panel';
import { useTeams } from '@/domains/teams/hooks/use-teams';
import { useTeamsStore } from '@/domains/teams/stores/teams-store';
import { getGetAdminTeamsQueryKey } from '@/services/-admin-teams-get';

export function TeamsDomain() {
  const queryClient = useQueryClient();
  const { openCreateDialog } = useTeamsStore();
  const { data: teams = [], isLoading, isError, refetch } = useTeams();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminTeamsQueryKey() });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconUsersGroup className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Teams</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Staff groups
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
                <IconPlus className='h-3.5 w-3.5' /> New team
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 px-6 py-8'>
        {isError ? (
          <div className='border-border/60 rounded-2xl border p-10 text-center'>
            <p className='text-destructive font-medium'>Failed to load teams.</p>
            <Button variant='outline' className='mt-4 rounded-xl' onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className='grid min-h-[640px] gap-4 lg:grid-cols-[320px_1fr]'>
            <aside className='border-border/60 bg-card/40 rounded-2xl border p-3'>
              <div className='mb-3 px-1'>
                <h2 className='text-sm font-bold'>All teams</h2>
                <p className='text-muted-foreground text-[11px]'>
                  Group staff for support routing and access visibility.
                </p>
              </div>
              <TeamList teams={teams} isLoading={isLoading} />
            </aside>

            <section className='border-border/60 bg-card/40 overflow-hidden rounded-2xl border'>
              <TeamMembersPanel />
            </section>
          </div>
        )}
      </div>

      <TeamFormDialog />
      <AddTeamMemberDialog />
    </div>
  );
}
