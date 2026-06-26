'use client';

import { useTranslations } from 'next-intl';

import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { useVendorStoreOrderStatsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-orders';
import { VendorOrdersTable } from '@/domains/vendor/panel/sections/vendor-orders-table';

export function VendorOrdersDomain() {
  const t = useTranslations('vendor.panel.orders');
  const { data: statsData } = useVendorStoreOrderStatsQuery();
  const total = statsData?.data?.total ?? 0;

  return (
    <div className='space-y-6'>
      <VendorModuleHeader
        title={t('title')}
        description={t('description')}
        badge={total > 0 ? t('ordersBadge', { count: total }) : undefined}
      />
      <VendorOrdersTable />
    </div>
  );
}
