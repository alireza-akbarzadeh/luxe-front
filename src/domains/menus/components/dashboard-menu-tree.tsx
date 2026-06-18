'use client';

import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
import { buildGroupItemTree } from '@/domains/menus/lib/menu-tree';
import { useMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { useDeleteAdminMenuItemsId } from '@/services/-admin-menu-items-{id}-delete';
import {
  getGetAdminMenuItemsQueryKey,
  useGetAdminMenuItems
} from '@/services/-admin-menu-items-get';
import type { ModelsMenuItem } from '@/services/-admin-menu-items-get.schemas';

import { MenuItemRowPreview } from './menu-item-row-preview';

interface DashboardMenuTreeProps {
  groupId: number;
}

export function DashboardMenuTree({ groupId }: DashboardMenuTreeProps) {
  const queryClient = useQueryClient();
  const { openItemDialog } = useMenuManagerStore();
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const { data: itemsResponse, isLoading } = useGetAdminMenuItems({ flat: true });
  const flatItems = useMemo(() => itemsResponse?.data?.items ?? [], [itemsResponse?.data?.items]);

  const tree = useMemo(() => buildGroupItemTree(flatItems, groupId), [flatItems, groupId]);

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteAdminMenuItemsId();

  const handleDelete = async () => {
    if (!deleteItemId) return;
    try {
      await deleteItem({ id: deleteItemId });
      toast.success('Menu item deleted');
      await queryClient.invalidateQueries({ queryKey: getGetAdminMenuItemsQueryKey() });
    } catch {
      toast.error('Failed to delete menu item');
    } finally {
      setDeleteItemId(null);
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='border-border/50 flex items-center justify-between border-b px-4 py-3'>
        <div>
          <p className='text-sm font-bold'>Menu items</p>
          <p className='text-muted-foreground text-[11px]'>Nested parent → child structure</p>
        </div>
        <Button
          size='sm'
          className='h-8 gap-1 rounded-lg text-[10px] font-bold uppercase'
          onClick={() => openItemDialog({ parentId: null })}
        >
          <IconPlus className='h-3.5 w-3.5' />
          Add item
        </Button>
      </div>

      <div className='flex-1 space-y-1 p-3'>
        {isLoading && <p className='text-muted-foreground py-8 text-center text-xs'>Loading items…</p>}
        {!isLoading && tree.length === 0 && (
          <p className='text-muted-foreground py-8 text-center text-xs'>
            No items in this group. Add a top-level link to get started.
          </p>
        )}
        {tree.map((item) => (
          <MenuTreeNode
            key={item.id}
            item={item}
            depth={0}
            onEdit={(id) => openItemDialog({ itemId: id })}
            onAddChild={(parentId) => openItemDialog({ parentId })}
            onDelete={(id) => setDeleteItemId(id)}
          />
        ))}
      </div>

      <AlertDialog open={deleteItemId != null} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              Child items under this entry will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
              Delete item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MenuTreeNode({
  item,
  depth,
  onEdit,
  onAddChild,
  onDelete
}: {
  item: ModelsMenuItem;
  depth: number;
  onEdit: (id: number) => void;
  onAddChild: (parentId: number) => void;
  onDelete: (id: number) => void;
}) {
  if (!item.id) return null;

  return (
    <div>
      <div className='group hover:bg-muted/40 flex items-center gap-2 rounded-xl border border-transparent px-2 py-2 transition'>
        <MenuItemRowPreview item={item} depth={depth} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-7 w-7 opacity-0 group-hover:opacity-100'>
              <IconDotsVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem onClick={() => onEdit(item.id!)}>
              <IconPencil className='mr-2 h-4 w-4' /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddChild(item.id!)}>
              <IconPlus className='mr-2 h-4 w-4' /> Add child
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => onDelete(item.id!)}
            >
              <IconTrash className='mr-2 h-4 w-4' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {(item.children ?? []).map((child) => (
        <MenuTreeNode
          key={child.id}
          item={child}
          depth={depth + 1}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
