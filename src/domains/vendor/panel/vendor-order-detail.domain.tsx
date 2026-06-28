'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import {
  ApiOrderStatusBadge,
  ApiPaymentStatusBadge
} from '@/domains/orders/components/order-api-badges';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VendorOrderFulfillmentPanel } from '@/domains/vendor/panel/components/vendor-order-fulfillment-panel';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreOrder } from '@/lib/api/vendor-orders';
import { formatCurrency } from '@/lib/format';

interface VendorOrderDetailDomainProps {
  orderId: number;
}

export function VendorOrderDetailDomain({ orderId }: VendorOrderDetailDomainProps) {
  const t = useTranslations('vendor.panel.orders');
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor-store-order', activeStoreId, orderId],
    queryFn: () => getVendorStoreOrder(activeStoreId, orderId),
    enabled: activeStoreId > 0 && orderId > 0
  });

  const order = data?.data;

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>{t('loadingDetail')}</p>;
  }

  if (error || !order) {
    return (
      <Flex direction='column' spacing={4}>
        <p className='text-destructive text-sm'>{t('detailNotFound')}</p>
        <Button variant='outline' asChild>
          <Link href='/vendor/panel/orders'>{t('backToOrders')}</Link>
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction='column' spacing={8} fullWidth>
      <VendorModuleHeader
        title={order.order_number ?? `#${order.id}`}
        description={order.customer_name}
        actions={
          <Button variant='outline' size='sm' className='rounded-xl' asChild>
            <Link href='/vendor/panel/orders'>{t('backToOrders')}</Link>
          </Button>
        }
      />

      <Grid cols={1} gap={4} className='md:grid-cols-3'>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle className='text-sm'>{t('detailStatus')}</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <ApiOrderStatusBadge status={order.status} size='md' />
            <ApiPaymentStatusBadge status={order.payment_status} size='md' />
          </CardContent>
        </Card>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle className='text-sm'>{t('detailYourTotal')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold tabular-nums'>
              {formatCurrency(order.store_subtotal ?? 0, order.currency ?? 'USD')}
            </p>
            <p className='text-muted-foreground text-xs'>
              {t('detailOrderTotal')}{' '}
              {formatCurrency(order.total_amount ?? 0, order.currency ?? 'USD')}
            </p>
          </CardContent>
        </Card>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle className='text-sm'>{t('detailCustomer')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-medium'>{order.customer_name}</p>
            <p className='text-muted-foreground text-sm' dir='ltr'>
              {order.customer_email}
            </p>
          </CardContent>
        </Card>
      </Grid>

      <VendorOrderFulfillmentPanel storeId={activeStoreId} orderId={orderId} />

      {order.tracking_number ? (
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle className='text-sm'>{t('detailShipping')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-mono text-sm'>{order.tracking_number}</p>
            <p className='text-muted-foreground text-sm'>{order.carrier}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle className='text-sm'>{t('detailLineItems')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Flex direction='column' spacing={3}>
            {(order.items ?? []).map((item) => (
              <Flex
                key={item.id}
                direction='row'
                align='center'
                justify='between'
                className='border-border/40 border-b pb-3 last:border-0 last:pb-0'
              >
                <div>
                  <p className='font-medium'>{item.name}</p>
                  <p className='text-muted-foreground text-xs'>
                    SKU {item.sku ?? '—'} · ×{item.quantity}
                  </p>
                </div>
                <p className='text-sm font-semibold tabular-nums'>
                  {formatCurrency(item.total_price, order.currency ?? 'USD')}
                </p>
              </Flex>
            ))}
          </Flex>
        </CardContent>
      </Card>
    </Flex>
  );
}
