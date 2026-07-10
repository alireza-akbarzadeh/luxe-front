'use client';

import { IconPencil, IconTrash, IconUsersGroup } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeamMutations } from '@/domains/teams/hooks/use-teams';
import { useTeamsStore } from '@/domains/teams/stores/teams-store';
import { cn } from '@/lib/utils';
import type { DtoTeamResponse } from '@/services/-admin-teams-get.schemas';

interface TeamListProps {
  teams: DtoTeamResponse[];
  isLoading: boolean;
}

export function TeamList({ teams, isLoading }: TeamListProps) {
  const { selectedTeamId, selectTeam, openEditDialog } = useTeamsStore();
  const { deleteTeam, isDeleting } = useTeamMutations();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedTeamId && teams.length > 0) {
      selectTeam(teams[0]?.id ?? null);
    }
  }, [teams, selectedTeamId, selectTeam]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTeam(deleteId);
      toast.success('Team deleted');
      if (selectedTeamId === deleteId) selectTeam(null);
    } catch {
      toast.error('Failed to delete team');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-20 w-full rounded-2xl' />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className='border-border/60 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center'>
        <IconUsersGroup className='text-muted-foreground mb-3 h-8 w-8' />
        <p className='text-sm font-semibold'>No teams yet</p>
        <p className='text-muted-foreground mt-1 text-xs'>Create a team to group staff members.</p>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-2'>
        {teams.map((team) => {
          if (!team.id) return null;
          const selected = selectedTeamId === team.id;
          return (
            <button
              key={team.id}
              type='button'
              onClick={() => selectTeam(team.id!)}
              className={cn(
                'border-border/60 w-full rounded-2xl border p-4 text-left transition-all',
                selected
                  ? 'border-primary/40 bg-primary/5 ring-primary/20 shadow-sm ring-1'
                  : 'bg-card/40 hover:bg-muted/30'
              )}
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <IconUsersGroup className='text-primary h-4 w-4 shrink-0' />
                    <p className='text-sm font-bold'>{team.name}</p>
                    <Badge variant='secondary' className='text-[10px] uppercase'>
                      {team.slug}
                    </Badge>
                  </div>
                  {team.description ? (
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                      {team.description}
                    </p>
                  ) : null}
                  <p className='text-muted-foreground mt-2 text-[10px]'>
                    {team.member_count ?? 0} member{(team.member_count ?? 0) === 1 ? '' : 's'}
                  </p>
                </div>
                <div className='flex shrink-0 gap-1'>
                  <Button
                    type='button'
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8'
                    aria-label={`Edit ${team.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditDialog(team.id!);
                    }}
                  >
                    <IconPencil className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    size='icon'
                    variant='ghost'
                    className='text-destructive hover:text-destructive h-8 w-8'
                    aria-label={`Delete ${team.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteId(team.id!);
                    }}
                  >
                    <IconTrash className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              All member assignments for this team will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={() => void handleDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
