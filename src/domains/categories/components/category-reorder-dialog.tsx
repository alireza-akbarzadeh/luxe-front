'use client';

import { IconGripVertical, IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Text } from '@/components/ui/typography';
import { getCategorySiblings, sortCategoriesByOrder } from '@/domains/categories/lib/category-tree';
import { reorderList } from '@/domains/menus/lib/nav-menu-payload';
import { cn } from '@/lib/utils';
import { usePutAdminCategoriesReorder } from '@/services/-admin-categories-reorder-put';
import { getGetCategoriesQueryKey } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

interface CategoryReorderDialogProps {
  roots: ModelsCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function flattenForParentOptions(nodes: ModelsCategory[], depth = 0): ModelsCategory[] {
  const result: ModelsCategory[] = [];
  for (const node of sortCategoriesByOrder(nodes)) {
    result.push({ ...node, name: `${'— '.repeat(depth)}${node.name}` });
    if (node.children?.length) {
      result.push(...flattenForParentOptions(node.children, depth + 1));
    }
  }
  return result;
}

/** Drag-and-drop reorder for categories sharing the same parent. */
export function CategoryReorderDialog({ roots, open, onOpenChange }: CategoryReorderDialogProps) {
  const queryClient = useQueryClient();
  const [parentKey, setParentKey] = useState<string>('root');
  const [reorderedItems, setReorderedItems] = useState<ModelsCategory[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const parentId = parentKey === 'root' ? null : Number(parentKey);

  const siblingsFromServer = useMemo(() => getCategorySiblings(roots, parentId), [roots, parentId]);

  const serverKey = siblingsFromServer.map((item) => `${item.id}-${item.sort_order}`).join('|');
  const [lastServerKey, setLastServerKey] = useState(serverKey);

  if (serverKey !== lastServerKey) {
    setLastServerKey(serverKey);
    setReorderedItems(null);
  }

  const orderedItems = reorderedItems ?? siblingsFromServer;
  const canReorder = orderedItems.length > 0 && orderedItems.every((item) => item.id != null);

  const reorderMutation = usePutAdminCategoriesReorder({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
      }
    }
  });

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setParentKey('root');
      setReorderedItems(null);
      setDragIndex(null);
    }
    onOpenChange(next);
  };

  const parentOptions = useMemo(() => flattenForParentOptions(roots), [roots]);

  const persistOrder = async (items: ModelsCategory[]) => {
    const payload = {
      items: items
        .filter((item) => item.id != null)
        .map((item, index) => ({
          id: item.id!,
          parent_id: parentId ?? undefined,
          sort_order: index
        }))
    };

    if (payload.items.length === 0) return;

    const hasChanges = payload.items.some(({ id, sort_order }) => {
      const previous = siblingsFromServer.find((item) => item.id === id);
      return (previous?.sort_order ?? 0) !== sort_order;
    });

    if (!hasChanges) return;

    try {
      await reorderMutation.mutateAsync({ data: payload });
      setReorderedItems(null);
      toast.success('Category order saved');
    } catch (error) {
      toast.error('Failed to save category order', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  const handleDragStart = (index: number) => {
    if (!canReorder || reorderMutation.isPending) return;
    setDragIndex(index);
  };

  const handleDragOver = (event: React.DragEvent, targetIndex: number) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex || reorderMutation.isPending) return;

    setReorderedItems((current) => reorderList(current ?? orderedItems, dragIndex, targetIndex));
    setDragIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setReorderedItems((current) => {
      const next = current ?? orderedItems;
      void persistOrder(next);
      return next;
    });
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      title='Reorder categories'
      description='Drag categories to change display order within the selected parent.'
    >
      <Flex direction='column' spacing={4}>
        <Flex direction='column' spacing={2}>
          <Label htmlFor='category-reorder-parent'>Parent level</Label>
          <Select
            value={parentKey}
            onValueChange={(value) => {
              setParentKey(value);
              setReorderedItems(null);
            }}
          >
            <SelectTrigger id='category-reorder-parent'>
              <SelectValue placeholder='Select parent' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='root'>Top-level categories</SelectItem>
              {parentOptions.map((option) =>
                option.id ? (
                  <SelectItem key={option.id} value={String(option.id)}>
                    Children of {option.name}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </Flex>

        {orderedItems.length === 0 ? (
          <Text variant='muted' className='text-sm'>
            No categories at this level.
          </Text>
        ) : (
          <Flex direction='column' spacing={2} className='max-h-80 overflow-y-auto'>
            {orderedItems.map((item, index) => (
              <Flex
                key={item.id}
                direction='row'
                align='center'
                spacing={3}
                draggable={canReorder && !reorderMutation.isPending}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'border-border/60 bg-card/40 rounded-lg border px-3 py-2',
                  dragIndex === index && 'ring-primary/40 ring-2'
                )}
              >
                <IconGripVertical className='text-muted-foreground size-4 shrink-0 cursor-grab' />
                <Flex direction='column' className='min-w-0 flex-1'>
                  <Text variant='small' className='truncate font-medium'>
                    {item.name ?? '—'}
                  </Text>
                  <Text variant='muted' className='truncate text-xs'>
                    /{item.slug ?? '—'}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}

        <Flex direction='row' justify='end' spacing={2}>
          <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          {reorderMutation.isPending ? (
            <Button type='button' disabled>
              <IconLoader2 className='size-4 animate-spin' />
              Saving…
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </AppDialog>
  );
}
