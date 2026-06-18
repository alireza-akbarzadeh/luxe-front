'use client';

import {
  IconChevronRight,
  IconDotsVertical,
  IconFolderPlus,
  IconPencil,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { cn } from '@/lib/utils';
import { useDeleteAdminMenuGroupsId } from '@/services/-admin-menu-groups-{id}-delete';
import {
  getGetAdminMenuGroupsQueryKey,
  useGetAdminMenuGroups
} from '@/services/-admin-menu-groups-get';
import { getGetAdminMenuItemsQueryKey } from '@/services/-admin-menu-items-get';

import { DashboardMenuGroupDialog } from './dashboard-menu-group-dialog';
import { DashboardMenuItemDialog } from './dashboard-menu-item-dialog';
import { DashboardMenuTree } from './dashboard-menu-tree';

export function DashboardMenuManager() {
  const queryClient = useQueryClient();
  const { selectedGroupId, selectGroup, openGroupDialog } = useMenuManagerStore();

  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);

  const { data: groupsResponse, isLoading: isGroupsLoading } = useGetAdminMenuGroups();
  const groups = groupsResponse?.data ?? [];

  const { mutateAsync: deleteGroup, isPending: isDeletingGroup } = useDeleteAdminMenuGroupsId();

  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetAdminMenuGroupsQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getGetAdminMenuItemsQueryKey() });
  };

  const handleDeleteGroup = async () => {
    if (!deleteGroupId) return;
    try {
      await deleteGroup({ id: deleteGroupId });
      toast.success('Menu group deleted');
      if (selectedGroupId === deleteGroupId) selectGroup(null);
      await invalidateAll();
    } catch {
      toast.error('Failed to delete group');
    } finally {
      setDeleteGroupId(null);
    }
  };

  return (
    <>
      <div className='grid min-h-[640px] gap-4 lg:grid-cols-[280px_1fr]'>
        <aside className='border-border/60 bg-card/40 flex flex-col rounded-2xl border p-3'>
          <div className='mb-3 flex items-center justify-between px-1'>
            <div>
              <p className='text-[10px] font-bold tracking-widest uppercase'>Menu groups</p>
              <p className='text-muted-foreground text-[11px]'>Sidebar sections</p>
            </div>
            <Button
              size='sm'
              className='h-8 gap-1 rounded-lg text-[10px] font-bold uppercase'
              onClick={() => openGroupDialog()}
            >
              <IconPlus className='h-3.5 w-3.5' />
              Add
            </Button>
          </div>

          <div className='space-y-1.5'>
            {isGroupsLoading && (
              <p className='text-muted-foreground px-2 py-6 text-center text-xs'>Loading groups…</p>
            )}
            {!isGroupsLoading && groups.length === 0 && (
              <p className='text-muted-foreground px-2 py-6 text-center text-xs'>
                No groups yet. Create your first section.
              </p>
            )}
            {groups.map((group) => {
              const isActive = group.id === selectedGroupId;
              return (
                <div
                  key={group.id}
                  className={cn(
                    'group flex items-center gap-2 rounded-xl border px-2 py-2 transition',
                    isActive
                      ? 'border-primary/30 bg-primary/10'
                      : 'border-transparent hover:bg-muted/50'
                  )}
                >
                  <button
                    type='button'
                    className='flex min-w-0 flex-1 items-start gap-2 text-left'
                    onClick={() => group.id && selectGroup(group.id)}
                  >
                    <IconChevronRight
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0 transition',
                        isActive ? 'text-primary rotate-90' : 'text-muted-foreground'
                      )}
                    />
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold'>{group.name}</p>
                      <p className='text-muted-foreground text-[10px]'>
                        Order {group.display_order ?? 0}
                      </p>
                    </div>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7 opacity-0 group-hover:opacity-100'
                      >
                        <IconDotsVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-44'>
                      <DropdownMenuItem onClick={() => openGroupDialog(group.id)}>
                        <IconPencil className='mr-2 h-4 w-4' /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-destructive focus:text-destructive'
                        onClick={() => group.id && setDeleteGroupId(group.id)}
                      >
                        <IconTrash className='mr-2 h-4 w-4' /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </aside>

        <section className='border-border/60 bg-card/30 flex flex-col rounded-2xl border'>
          {!selectedGroupId ? (
            <div className='text-muted-foreground flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center'>
              <IconFolderPlus className='h-10 w-10 opacity-40' />
              <p className='text-sm font-medium'>Select a menu group</p>
              <p className='max-w-sm text-xs'>
                Choose a group on the left to manage its nested menu items.
              </p>
            </div>
          ) : (
            <DashboardMenuTree groupId={selectedGroupId} />
          )}
        </section>
      </div>

      <DashboardMenuGroupDialog />
      <DashboardMenuItemDialog />

      <AlertDialog
        open={deleteGroupId != null}
        onOpenChange={(open) => !open && setDeleteGroupId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu group?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the group and cascades deletion to all nested menu items inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingGroup}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeletingGroup} onClick={handleDeleteGroup}>
              Delete group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
