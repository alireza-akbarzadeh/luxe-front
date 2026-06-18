'use client';

import { IconDotsVertical, IconGripVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
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
import { reorderNavMenus } from '@/domains/menus/api/reorder-nav-menus';
import { reorderList, sortNavMenuItems } from '@/domains/menus/lib/nav-menu-payload';
import { useSiteMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { cn } from '@/lib/utils';
import { useDeleteNavMenusId } from '@/services/-nav-menus-{id}-delete';
import { getGetNavMenusQueryKey, useGetNavMenus } from '@/services/-nav-menus-get';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

import { SiteMenuFormDialog } from './site-menu-form-dialog';
import { SiteMenuItemPreview } from './site-menu-item-preview';

function stopCardInteraction(event: React.SyntheticEvent) {
  event.stopPropagation();
}

export function SiteMenuList() {
  const queryClient = useQueryClient();
  const { openDialog } = useSiteMenuManagerStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [orderedItems, setOrderedItems] = useState<DtoNavItemResponse[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const serverSnapshotRef = useRef<DtoNavItemResponse[]>([]);

  const { data: response, isLoading } = useGetNavMenus();
  const canReorder = orderedItems.length > 0 && orderedItems.every((item) => item.id != null);

  const { mutateAsync: deleteNav, isPending: isDeleting } = useDeleteNavMenusId();

  useEffect(() => {
    if (!response?.data) return;
    const sorted = sortNavMenuItems(response.data);
    setOrderedItems(sorted);
    serverSnapshotRef.current = sorted;
  }, [response?.data]);

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

  const persistOrder = async (items: DtoNavItemResponse[]) => {
    const payload = {
      items: items
        .filter((item) => item.id != null)
        .map((item, index) => ({ id: item.id!, order: index + 1 }))
    };

    if (payload.items.length === 0) return;

    const hasChanges = payload.items.some(({ id, order }) => {
      const previous = serverSnapshotRef.current.find((item) => item.id === id);
      return (previous?.order ?? 0) !== order;
    });

    if (!hasChanges) return;

    setIsSavingOrder(true);
    try {
      await reorderNavMenus(payload);
      serverSnapshotRef.current = items.map((item, index) => ({ ...item, order: index + 1 }));
      await queryClient.invalidateQueries({ queryKey: getGetNavMenusQueryKey() });
      toast.success('Menu order saved');
    } catch {
      toast.error('Failed to save menu order');
      await queryClient.invalidateQueries({ queryKey: getGetNavMenusQueryKey() });
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (index: number) => {
    if (!canReorder || isSavingOrder) return;
    setDragIndex(index);
  };

  const handleDragOver = (event: React.DragEvent, targetIndex: number) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex || isSavingOrder) return;

    setOrderedItems((current) => reorderList(current, dragIndex, targetIndex));
    setDragIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOrderedItems((current) => {
      void persistOrder(current);
      return current;
    });
  };

  const handleEdit = (item: DtoNavItemResponse, displayOrder: number) => {
    if (!item.id) return;
    openDialog({ ...item, order: displayOrder });
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-base font-black tracking-tight'>Storefront navigation</h2>
          <p className='text-muted-foreground mt-0.5 max-w-2xl text-[11px] leading-relaxed'>
            Flat list of top-level header items. Simple links go directly to a URL; mega menus
            contain columns and links inside the dropdown. Drag to reorder what shoppers see on the
            site.
          </p>
        </div>
        <Button
          size='sm'
          className='h-9 shrink-0 gap-2 rounded-xl text-[10px] font-bold uppercase'
          onClick={() => openDialog()}
        >
          <IconPlus className='h-3.5 w-3.5' /> Add nav item
        </Button>
      </div>

      {isLoading && (
        <p className='text-muted-foreground py-12 text-center text-sm'>Loading navigation…</p>
      )}

      {!isLoading && orderedItems.length === 0 && (
        <div className='border-border/60 rounded-2xl border border-dashed py-16 text-center'>
          <p className='text-sm font-medium'>No navigation items yet</p>
          <p className='text-muted-foreground mt-1 text-xs'>
            Add a link (Collections, Gift Cards) or a mega menu (Women, Men).
          </p>
          <Button className='mt-4' size='sm' onClick={() => openDialog()}>
            <IconPlus className='mr-2 h-4 w-4' /> Create first item
          </Button>
        </div>
      )}

      <div className={cn('space-y-3', isSavingOrder && 'pointer-events-none opacity-70')}>
        {orderedItems.map((item, index) => (
          <SiteMenuCard
            key={item.id ?? `${item.label}-${index}`}
            item={item}
            displayOrder={index + 1}
            isDragging={dragIndex === index}
            canDrag={canReorder && !isSavingOrder}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={handleDragEnd}
            onEdit={() => handleEdit(item, index + 1)}
            onDelete={() => item.id && setDeleteId(item.id)}
          />
        ))}
      </div>

      <SiteMenuFormDialog itemCount={orderedItems.length} />

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
  displayOrder,
  isDragging,
  canDrag,
  onDragStart,
  onDragOver,
  onDragEnd,
  onEdit,
  onDelete
}: {
  item: DtoNavItemResponse;
  displayOrder: number;
  isDragging: boolean;
  canDrag: boolean;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isMega = item.type === 'mega';

  return (
    <div
      draggable={canDrag}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        'border-border/60 bg-card/50 group rounded-2xl border p-4 transition-shadow',
        isDragging && 'border-primary/40 shadow-md ring-2 ring-primary/20',
        canDrag && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className='flex items-start gap-3'>
        <div
          className={cn(
            'text-muted-foreground hover:text-foreground mt-0.5 shrink-0 rounded-md p-1 transition-colors',
            canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40'
          )}
          onMouseDown={stopCardInteraction}
          onClick={stopCardInteraction}
        >
          <IconGripVertical className='h-4 w-4' aria-hidden />
          <span className='sr-only'>Drag to reorder {item.label ?? 'navigation item'}</span>
        </div>

        <div className='min-w-0 flex-1'>
          <button
            type='button'
            className='hover:bg-muted/30 -mx-2 w-[calc(100%+0.5rem)] rounded-xl px-2 py-1 text-left transition-colors'
            onClick={onEdit}
            disabled={!item.id}
          >
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
              <span className='text-muted-foreground text-[10px]'>#{displayOrder}</span>
            </div>
          </button>

          <div onClick={stopCardInteraction} onKeyDown={stopCardInteraction}>
            <SiteMenuItemPreview item={item} />
          </div>
        </div>

        <div
          className='flex shrink-0 items-center gap-1'
          onClick={stopCardInteraction}
          onKeyDown={stopCardInteraction}
        >
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='hidden h-8 gap-1 text-[10px] font-bold uppercase sm:inline-flex'
            disabled={!item.id}
            onClick={onEdit}
          >
            <IconPencil className='h-3.5 w-3.5' /> Edit
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='text-destructive hover:text-destructive hidden h-8 gap-1 text-[10px] font-bold uppercase sm:inline-flex'
            disabled={!item.id}
            onClick={onDelete}
          >
            <IconTrash className='h-3.5 w-3.5' /> Delete
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8 sm:hidden'>
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
      </div>
    </div>
  );
}
