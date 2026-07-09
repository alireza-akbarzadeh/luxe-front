'use client';

import {
  IconArchive,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconRefresh
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
import { buildDuplicateProductRequest } from '@/domains/product-dashboard/lib/build-duplicate-product-request';
import { getProductsId } from '@/services/-products-{id}-get';
import { usePutProductsId } from '@/services/-products-{id}-put';
import { getGetProductsQueryKey } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { usePostProducts } from '@/services/-products-post';

interface ProductRowActionsProps {
  product: DtoProductWithLike;
}

type PendingAction = 'archive' | 'duplicate' | null;

export function ProductRowActions({ product }: ProductRowActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const productId = product.id;

  const invalidateProducts = () => {
    void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
  };

  const archiveMutation = usePutProductsId({
    mutation: {
      onSuccess: () => {
        invalidateProducts();
        toast.success('Product archived');
        setPendingAction(null);
      },
      onError: () => {
        toast.error('Failed to archive product');
        setPendingAction(null);
      }
    }
  });

  const duplicateMutation = usePostProducts({
    mutation: {
      onSuccess: (response) => {
        invalidateProducts();
        const newId = response.data?.id;
        toast.success('Product duplicated');
        setPendingAction(null);
        if (newId) {
          router.push(`/dashboard/products/edit/${newId}`);
        }
      },
      onError: () => {
        toast.error('Failed to duplicate product');
        setPendingAction(null);
      }
    }
  });

  const handleConfirm = async () => {
    if (!productId || !pendingAction) return;

    if (pendingAction === 'archive') {
      archiveMutation.mutate({ id: productId, data: { status: 'archived' } });
      return;
    }

    try {
      const response = await getProductsId(String(productId));
      const fullProduct = response.data?.product;
      if (!fullProduct) {
        toast.error('Could not load product details');
        setPendingAction(null);
        return;
      }
      duplicateMutation.mutate({ data: buildDuplicateProductRequest(fullProduct) });
    } catch {
      toast.error('Could not load product details');
      setPendingAction(null);
    }
  };

  const isPending = archiveMutation.isPending || duplicateMutation.isPending;

  if (!productId) return null;

  const isArchived = product.status === 'archived';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            disabled={isPending}
            aria-label='Product actions'
          >
            <IconDotsVertical className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52 rounded-xl p-1'>
          <DropdownMenuItem
            className='gap-2 text-xs'
            onClick={() => router.push(`/dashboard/products/edit/${productId}`)}
          >
            <IconEdit className='size-3.5' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className='gap-2 text-xs' onClick={() => setPendingAction('duplicate')}>
            <IconCopy className='size-3.5' />
            Duplicate
          </DropdownMenuItem>
          {!isArchived ? (
            <DropdownMenuItem className='gap-2 text-xs' onClick={() => setPendingAction('archive')}>
              <IconArchive className='size-3.5' />
              Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className='gap-2 text-xs'
              onClick={() => archiveMutation.mutate({ id: productId, data: { status: 'draft' } })}
            >
              <IconRefresh className='size-3.5' />
              Restore to draft
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-muted-foreground gap-2 text-[10px] uppercase' disabled>
            #{productId}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === 'archive' ? 'Archive this product?' : 'Duplicate this product?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === 'archive'
                ? `${product.name ?? 'This product'} will be hidden from the catalog until restored.`
                : `A draft copy of ${product.name ?? 'this product'} will be created.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={() => void handleConfirm()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
