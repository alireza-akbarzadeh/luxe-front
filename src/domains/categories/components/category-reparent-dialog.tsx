'use client';

import { IconLoader2 } from '@tabler/icons-react';
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
import { isInvalidCategoryParentMove } from '@/domains/categories/lib/category-tree';
import { getGetAdminCategoriesIdQueryKey } from '@/services/-admin-categories-{id}-get';
import { usePutAdminCategoriesId } from '@/services/-admin-categories-{id}-put';
import { getGetCategoriesQueryKey } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

interface CategoryReparentDialogProps {
  category: ModelsCategory | null;
  allCategories: ModelsCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function flattenForOptions(nodes: ModelsCategory[], depth = 0): ModelsCategory[] {
  const result: ModelsCategory[] = [];
  for (const node of nodes) {
    result.push({ ...node, name: `${'— '.repeat(depth)}${node.name}` });
    if (node.children?.length) result.push(...flattenForOptions(node.children, depth + 1));
  }
  return result;
}

/** Dialog to move a category under a new parent (or to top level). */
export function CategoryReparentDialog({
  category,
  allCategories,
  open,
  onOpenChange
}: CategoryReparentDialogProps) {
  const queryClient = useQueryClient();
  const [parentId, setParentId] = useState<string>('root');

  const updateMutation = usePutAdminCategoriesId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        if (category?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetAdminCategoriesIdQueryKey(category.id)
          });
        }
      }
    }
  });

  const parentOptions = useMemo(() => {
    if (!category?.id) return [];
    return flattenForOptions(allCategories).filter((c) => {
      if (c.id === category.id) return false;
      return !isInvalidCategoryParentMove(category, c.id ?? null);
    });
  }, [allCategories, category]);

  const handleOpenChange = (next: boolean) => {
    if (next && category) {
      setParentId(category.parent_id ? String(category.parent_id) : 'root');
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    if (!category?.id) return;

    const nextParentId = parentId === 'root' ? undefined : Number(parentId);
    if (isInvalidCategoryParentMove(category, nextParentId ?? null)) {
      toast.error('Invalid parent', { description: 'A category cannot be moved under itself.' });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: category.id,
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          parent_id: nextParentId
        }
      });
      toast.success('Category moved');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to move category', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      title='Move category'
      description={
        category?.name
          ? `Choose a new parent for "${category.name}" or set it as top-level.`
          : undefined
      }
    >
      <Flex direction='column' spacing={4}>
        <Flex direction='column' spacing={2}>
          <Label htmlFor='category-parent-select'>Parent category</Label>
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger id='category-parent-select'>
              <SelectValue placeholder='Select parent' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='root'>None (top-level)</SelectItem>
              {parentOptions.map((option) =>
                option.id ? (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </Flex>

        <Flex direction='row' justify='end' spacing={2}>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={() => void handleSubmit()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <IconLoader2 className='size-4 animate-spin' />
                Saving…
              </>
            ) : (
              'Move category'
            )}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
