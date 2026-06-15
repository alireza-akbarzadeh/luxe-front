'use client';

import { IconChevronRight, IconRotateClockwise, IconTruck } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { sectionContainerClass } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';

interface StoreDetailMetaBarProps {
  storeName: string;
  returnPolicy?: string | null;
  shippingInfo?: string | null;
  className?: string;
}

/** Below hero: breadcrumb (left) and store policies (right). */
export function StoreDetailMetaBar({
  storeName,
  returnPolicy,
  shippingInfo,
  className
}: StoreDetailMetaBarProps) {
  return (
    <div
      className={cn(
        sectionContainerClass,
        'border-gold/10 flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
        className
      )}
    >
      <DynamicBreadcrumb
        items={[
          { label: 'Stores', href: '/store' },
          { label: storeName }
        ]}
        showBackButton={false}
        direction='row'
        separator={<IconChevronRight className='h-3 w-3' aria-hidden />}
        className='text-muted-foreground min-w-0 text-xs'
        breadcrumbClassName='flex flex-wrap items-center gap-1.5'
      />

      {(returnPolicy || shippingInfo) && (
        <div className='text-muted-foreground flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:justify-end'>
          {shippingInfo && (
            <span className='inline-flex items-center gap-1.5'>
              <IconTruck className='text-gold h-4 w-4 shrink-0' aria-hidden />
              {shippingInfo}
            </span>
          )}
          {returnPolicy && (
            <span className='inline-flex items-center gap-1.5'>
              <IconRotateClockwise className='text-gold h-4 w-4 shrink-0' aria-hidden />
              {returnPolicy}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
