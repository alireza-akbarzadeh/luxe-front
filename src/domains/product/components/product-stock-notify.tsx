'use client';

import { IconBell, IconBellRinging } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { isUnauthorizedError } from '@/lib/api/api-utils';
import { useDeleteProductsIdStockNotifications } from '@/services/-products-{id}-stock-notifications-delete';
import {
  getGetProductsIdStockNotificationsQueryKey,
  useGetProductsIdStockNotifications
} from '@/services/-products-{id}-stock-notifications-get';
import { usePostProductsIdStockNotifications } from '@/services/-products-{id}-stock-notifications-post';

interface ProductStockNotifyProps {
  productId: number;
  productSlug: string;
  isOutOfStock: boolean;
}

/** Subscribe to back-in-stock notifications via the platform notification system. */
export function ProductStockNotify({
  productId,
  productSlug,
  isOutOfStock
}: ProductStockNotifyProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const productIdStr = String(productId);

  const invalidateStatus = () => {
    queryClient.invalidateQueries({
      queryKey: getGetProductsIdStockNotificationsQueryKey(productIdStr)
    });
  };

  const statusQuery = useGetProductsIdStockNotifications(productIdStr, {
    query: { enabled: isAuthenticated && isOutOfStock && Boolean(productId) }
  });

  const subscribe = usePostProductsIdStockNotifications({
    mutation: { onSuccess: invalidateStatus }
  });

  const unsubscribe = useDeleteProductsIdStockNotifications({
    mutation: { onSuccess: invalidateStatus }
  });

  if (!isOutOfStock) return null;

  const subscribed = statusQuery.data?.data?.subscribed ?? false;
  const isPending = subscribe.isPending || unsubscribe.isPending;

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.message('Sign in to get notified when this item is back');
      return;
    }
    try {
      if (subscribed) {
        await unsubscribe.mutateAsync({ id: productIdStr });
        toast.success('Stock alert removed');
      } else {
        await subscribe.mutateAsync({ id: productIdStr });
        toast.success("We'll notify you when this is back in stock");
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast.error('Sign in to subscribe');
        return;
      }
      toast.error('Could not update notification preference');
    }
  };

  if (!isAuthenticated) {
    return (
      <Button asChild variant='outline' className='w-full rounded-full'>
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}>
          <IconBell className='mr-2 h-4 w-4' />
          Notify me when back in stock
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type='button'
      variant={subscribed ? 'secondary' : 'outline'}
      className='w-full rounded-full'
      disabled={isPending || statusQuery.isLoading}
      onClick={() => void handleClick()}
    >
      {subscribed ? (
        <>
          <IconBellRinging className='mr-2 h-4 w-4' />
          Alert on — click to unsubscribe
        </>
      ) : (
        <>
          <IconBell className='mr-2 h-4 w-4' />
          Notify me when back in stock
        </>
      )}
    </Button>
  );
}
