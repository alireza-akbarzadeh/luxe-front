'use client';

import {
  IconChevronRight,
  IconCreditCard,
  IconEdit,
  IconHeart,
  IconHome,
  IconMapPin,
  IconPackage
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { OrderNumber } from '@/components/order-number';
import { Button } from '~/src/components/ui/button';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';
import type { DtoDefaultAddressDTO } from '~/src/services/-account-summary-get.schemas';

import { AccountProfileForm } from '../components/account-profile-form';
import { OrderStatusBadge } from '../components/order-status-badge';
import { useSidebarTab } from '../hooks/useSidebarTab';
import { formatOrderAmount } from '../lib/order-utils';

export function AccountOverview() {
  const { setActiveTab } = useSidebarTab();
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations('account.overview');
  const tCommon = useTranslations('account.common');

  const { data: summaryData, isLoading, error } = useGetAccountSummary();

  const user = summaryData?.data;
  const defaultShipping = user?.default_shipping_address;
  const defaultBilling = user?.default_billing_address;

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const formatAddress = (address: DtoDefaultAddressDTO) => {
    if (!address) return t('noAddress');
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  const addressCount = summaryData?.data?.address_count ?? 0;
  const likedProductsCount = summaryData?.data?.liked_products_count ?? 0;
  const recentOrders = summaryData?.data?.recent_orders ?? [];

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='bg-card border-border h-32 rounded-2xl border p-6' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-card border-border rounded-2xl border p-6 text-center'>
        <p className='text-destructive'>{t('loadError')}</p>
        <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='bg-card border-border rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground'>{t('noProfile')}</p>
      </div>
    );
  }

  const stats = [
    { label: t('stats.totalOrders'), value: recentOrders.length, icon: IconPackage },
    { label: t('stats.wishlistItems'), value: likedProductsCount, icon: IconHeart },
    { label: t('stats.savedAddresses'), value: addressCount, icon: IconMapPin }
  ];

  return (
    <div className='space-y-6'>
      <div className='bg-card border-border rounded-2xl border p-6'>
        <div className='mb-6 flex items-start justify-between'>
          <h2 className='text-xl font-semibold'>{t('profileTitle')}</h2>
          {isEditing ? (
            <Button variant='ghost' size='sm' onClick={handleCancelEditing}>
              <IconEdit className='me-2 h-4 w-4' />
              {tCommon('cancel')}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant='ghost' size='sm'>
              <IconEdit className='me-2 h-4 w-4' />
              {tCommon('edit')}
            </Button>
          )}
        </div>

        <AccountProfileForm
          open={isEditing}
          onOpenChange={setIsEditing}
          onClose={handleCancelEditing}
          defaultValues={{
            firstName: user?.first_name ?? '',
            lastName: user?.last_name ?? '',
            email: user?.email ?? '',
            phone: user?.phone ?? ''
          }}
        />
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6'>
          <div className='bg-accent/20 flex h-20 w-20 items-center justify-center rounded-full'>
            <span className='text-accent text-2xl font-semibold'>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div>
            <h3 className='text-lg font-medium'>
              {user.first_name} {user.last_name}
            </h3>
            <p className='text-muted-foreground'>{user.email}</p>
            {user.phone ? <p className='text-muted-foreground'>{user.phone}</p> : null}
          </div>
        </div>
      </div>

      <div className='bg-card border-border rounded-2xl border p-6'>
        <h2 className='mb-4 text-xl font-semibold'>{t('defaultAddressesTitle')}</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='bg-muted/50 rounded-xl p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <IconHome className='text-accent h-5 w-5' />
              <h3 className='font-medium'>{t('shippingAddress')}</h3>
            </div>
            <p className='text-muted-foreground text-sm'>
              {formatAddress(defaultShipping as DtoDefaultAddressDTO)}
            </p>
          </div>
          <div className='bg-muted/50 rounded-xl p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <IconCreditCard className='text-accent h-5 w-5' />
              <h3 className='font-medium'>{t('billingAddress')}</h3>
            </div>
            <p className='text-muted-foreground text-sm'>
              {formatAddress(defaultBilling as DtoDefaultAddressDTO)}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className='bg-card border-border rounded-xl border p-4 text-center sm:p-6'
            >
              <Icon className='text-accent mx-auto mb-3 h-8 w-8' />
              <p className='text-3xl font-bold'>{stat.value}</p>
              <p className='text-muted-foreground text-sm'>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className='bg-card border-border rounded-2xl border p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>{t('recentOrdersTitle')}</h2>
          <Button variant='ghost' size='sm' onClick={() => setActiveTab('orders')}>
            {tCommon('viewAll')}
            <IconChevronRight className='cn-rtl-flip ms-1 h-4 w-4' />
          </Button>
        </div>
        <div className='space-y-4'>
          {recentOrders.length === 0 ? (
            <div className='bg-muted/50 text-muted-foreground rounded-xl p-4 text-center'>
              {t('noOrders')}
            </div>
          ) : (
            recentOrders.map((order) => {
              const orderNumber = order.order_number ?? 'N/A';
              const createdAt = order.created_at ?? '';
              const status = order.status ?? '';
              const totalAmount = order.total_amount ?? 0;

              return (
                <div
                  key={order.id}
                  className='bg-muted/50 flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='min-w-0'>
                    <OrderNumber value={orderNumber} size='sm' />
                    <p className='text-muted-foreground text-sm'>
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString()
                        : tCommon('noDate')}
                    </p>
                  </div>
                  <div className='flex flex-col gap-2 sm:items-end'>
                    <OrderStatusBadge status={status} />
                    <p className='text-sm font-medium tabular-nums'>
                      {formatOrderAmount(totalAmount)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
