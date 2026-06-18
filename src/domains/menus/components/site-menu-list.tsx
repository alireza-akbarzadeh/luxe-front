'use client';

import { IconDotsVertical, IconLink, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSiteMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { useDeleteNavMenusId } from '@/services/-nav-menus-{id}-delete';
import { getGetNavMenusQueryKey, useGetNavMenus } from '@/services/-nav-menus-get';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

import { SiteMenuFormDialog } from './site-menu-form-dialog';

export function SiteMenuList() {
  const queryClient = useQueryClient();
  const { openDialog } = useSiteMenuManagerStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: response, isLoading } = useGetNavMenus();
  const items = [...(response?.data ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const { mutateAsync: deleteNav, isPending: isDeleting } = useDeleteNavMenusId();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNav({ id: deleteId });
      toast.success('Navigation item deleted');
      await queryClient.invalidateQueries({ queryKey: getGetNavMenusQueryKey() });
    } catch {
      toast.error('Failed to delete navigation item');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-base font-black tracking-tight'>Storefront navigation</h2>
          <p className='text-muted-foreground mt-0.5 text-[11px]'>
            Top navbar links and mega-menu dropdowns for the public site.
          </p>
        </div>
        <Button
          size='sm'
          className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
          onClick={() => openDialog()}
        >
          <IconPlus className='h-3.5 w-3.5' /> Add nav item
        </Button>
      </div>

      {isLoading && <p className='text-muted-foreground py-12 text-center text-sm'>Loading navigation…</p>}

      {!isLoading && items.length === 0 && (
        <div className='border-border/60 rounded-2xl border border-dashed py-16 text-center'>
          <p className='text-sm font-medium'>No navigation items yet</p>
          <p className='text-muted-foreground mt-1 text-xs'>Create your first storefront menu link or mega menu.</p>
        </div>
      )}

      <div className='space-y-3'>
        {items.map((item, index) => (
          <SiteMenuCard
            key={item.id ?? `${item.label}-${index}`}
            item={item}
            onEdit={() => item.id && openDialog(item.id)}
            onDelete={() => item.id && setDeleteId(item.id)}
          />
        ))}
      </div>

      <SiteMenuFormDialog />

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete navigation item?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the item from the storefront header immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SiteMenuCard({
  item,
  onEdit,
  onDelete
}: {
  item: DtoNavItemResponse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isMega = item.type === 'mega';
  const columnCount = item.columns?.length ?? 0;
  const featuredCount = item.featured?.length ?? 0;

  return (
    <div className='border-border/60 bg-card/50 group flex items-start justify-between gap-4 rounded-2xl border p-4'>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-sm font-bold'>{item.label}</p>
          <Badge variant={isMega ? 'default' : 'secondary'} className='text-[10px] uppercase'>
            {item.type ?? 'link'}
          </Badge>
          {item.badge ? (
            <Badge variant='outline' className='text-[10px]'>
              {item.badge}
            </Badge>
          ) : null}
          <span className='text-muted-foreground text-[10px]'>Order {item.order ?? 0}</span>
        </div>
        {item.href ? (
          <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
            <IconLink className='h-3.5 w-3.5' />
            {item.href}
          </p>
        ) : null}
        {isMega ? (
          <p className='text-muted-foreground mt-2 text-[11px]'>
            {columnCount} column{columnCount === 1 ? '' : 's'} · {featuredCount} featured
          </p>
        ) : null}
        {!item.id ? (
          <p className='text-destructive mt-2 text-[11px]'>
            Missing item ID — restart the API and refresh to enable edit/delete.
          </p>
        ) : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8 shrink-0'>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem disabled={!item.id} onClick={onEdit}>
            <IconPencil className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!item.id}
            className='text-destructive focus:text-destructive'
            onClick={onDelete}
          >
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
