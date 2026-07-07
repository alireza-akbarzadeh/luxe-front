'use client';

import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { listVendorStores } from '@/lib/api/vendor-stores';
import { cn } from '@/lib/utils';

export function TopNavStoreSwitcher() {
  const t = useTranslations('vendor.panel.topNav');
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const setActiveStore = useVendorPanelStore((s) => s.setActiveStore);

  const { data: storesData } = useQuery({
    queryKey: ['vendor-stores'],
    queryFn: listVendorStores
  });
  const vendorStores = storesData?.data ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='hidden h-9 gap-2 rounded-xl lg:inline-flex'>
          <span className='bg-gold/15 text-gold flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold'>
            {activeStoreName?.[0]?.toUpperCase() ?? '·'}
          </span>
          <span className='max-w-32 truncate'>{activeStoreName}</span>
          <IconChevronDown className='ml-1 size-3.5 shrink-0 opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>{t('switchStore')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {vendorStores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setActiveStore(store)}
            className={cn(
              'flex items-center justify-between gap-2',
              activeStoreId === store.id && 'bg-accent'
            )}
          >
            <span className='truncate'>{store.name}</span>
            {activeStoreId === store.id && <IconCheck className='text-gold size-3.5 shrink-0' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
