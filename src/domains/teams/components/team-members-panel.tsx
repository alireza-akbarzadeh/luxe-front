'use client';

import { IconPlus, IconTrash, IconUser } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeam, useTeamMutations } from '@/domains/teams/hooks/use-teams';
import { useTeamsStore } from '@/domains/teams/stores/teams-store';

export function TeamMembersPanel() {
  const { selectedTeamId, openAddMemberDialog } = useTeamsStore();
  const { data: team, isLoading } = useTeam(selectedTeamId);
  const { removeMember, isRemovingMember } = useTeamMutations();

  const handleRemove = async (userId: number) => {
    if (!selectedTeamId) return;
    try {
      await removeMember({ teamId: selectedTeamId, userId });
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  };

  if (!selectedTeamId) {
    return (
      <div className='border-border/60 flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed p-8 text-center'>
        <p className='text-muted-foreground text-sm'>Select a team to manage members.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-3 p-4'>
        <Skeleton className='h-10 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    );
  }

  const members = team?.members ?? [];

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='border-border/60 flex items-start justify-between gap-4 border-b px-4 py-4'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-base font-bold'>{team?.name}</h3>
            <Badge variant='secondary' className='text-[10px] uppercase'>
              {team?.slug}
            </Badge>
          </div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {members.length} member{members.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button size='sm' className='h-9 gap-2 rounded-xl' onClick={openAddMemberDialog}>
          <IconPlus className='h-4 w-4' />
          Add member
        </Button>
      </div>

      <ScrollArea className='flex-1 p-4'>
        {members.length === 0 ? (
          <div className='border-border/60 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center'>
            <IconUser className='text-muted-foreground mb-3 h-8 w-8' />
            <p className='text-sm font-semibold'>No members yet</p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Add staff users to this team for assignment and visibility.
            </p>
          </div>
        ) : (
          <div className='space-y-2'>
            {members.map((member) => {
              if (!member.user_id) return null;
              const name = [member.first_name, member.last_name].filter(Boolean).join(' ').trim();
              return (
                <div
                  key={member.user_id}
                  className='border-border/60 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3'
                >
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>
                      {name || member.email || `User #${member.user_id}`}
                    </p>
                    {member.email ? (
                      <p className='text-muted-foreground truncate text-xs'>{member.email}</p>
                    ) : null}
                  </div>
                  <div className='flex shrink-0 items-center gap-2'>
                    <Badge variant='outline' className='text-[10px] uppercase'>
                      {member.role ?? 'member'}
                    </Badge>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='text-destructive hover:text-destructive h-8 w-8'
                      disabled={isRemovingMember}
                      aria-label={`Remove ${name || member.email}`}
                      onClick={() => void handleRemove(member.user_id!)}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
