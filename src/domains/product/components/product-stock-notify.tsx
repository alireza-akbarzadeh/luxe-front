'use client';

import { IconBell, IconBellRinging } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('pdp.stockNotify');
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
      toast.message(t('toastSignIn'));
      return;
    }
    try {
      if (subscribed) {
        await unsubscribe.mutateAsync({ id: productIdStr });
        toast.success(t('toastRemoved'));
      } else {
        await subscribe.mutateAsync({ id: productIdStr });
        toast.success(t('toastSubscribed'));
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast.error(t('toastSignInSubscribe'));
        return;
      }
      toast.error(t('toastFailed'));
    }
  };

  if (!isAuthenticated) {
    return (
      <Button asChild variant='outline' className='w-full rounded-full'>
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}>
          <IconBell className='me-2 h-4 w-4' />
          {t('notifyMe')}
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
          <IconBellRinging className='me-2 h-4 w-4' />
          {t('subscribed')}
        </>
      ) : (
        <>
          <IconBell className='me-2 h-4 w-4' />
          {t('notifyMe')}
        </>
      )}
    </Button>
  );
}
