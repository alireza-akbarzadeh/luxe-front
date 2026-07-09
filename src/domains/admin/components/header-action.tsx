'use client';

import { IconPackage, IconPlus, IconTags, IconTicket, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
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
import { NotificationCenter } from '@/domains/admin/components/notification-center';

export function HeaderActions() {
  const t = useTranslations('adminShell.quickActions');

  return (
    <div className='flex items-center gap-1.5'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='sm'
            className='dashboard-quick-action hidden h-9 shrink-0 rounded-xl px-0 font-medium md:inline-flex md:px-3'
            aria-label={t('label')}
          >
            <IconPlus className='h-4 w-4 md:mr-0' />
            <span className='hidden lg:inline'>{t('label')}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='border-border/40 bg-popover/95 z-50 w-60 rounded-2xl p-2 shadow-2xl backdrop-blur-md'
        >
          <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[10px] font-bold tracking-widest uppercase'>
            {t('inventorySales')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='opacity-50' />

          <DropdownMenuItem
            asChild
            className='hover:bg-muted/20 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/products/create'>
              <div className='shrink-0 rounded-lg bg-blue-500/10 p-2'>
                <IconPackage className='h-4 w-4 text-blue-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  {t('newProduct')}
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  {t('newProductDescription')}
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                P
              </kbd>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/collections/create'>
              <div className='shrink-0 rounded-lg bg-pink-500/10 p-2'>
                <IconTags className='h-4 w-4 text-pink-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  {t('newCollection')}
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  {t('newCollectionDescription')}
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                C
              </kbd>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/discounts/create'>
              <div className='shrink-0 rounded-lg bg-purple-500/10 p-2'>
                <IconTicket className='h-4 w-4 text-purple-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  {t('newDiscount')}
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  {t('newDiscountDescription')}
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                D
              </kbd>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className='hover:bg-muted/80 focus:bg-muted/80 flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors'
          >
            <Link href='/dashboard/customers/create'>
              <div className='shrink-0 rounded-lg bg-emerald-500/10 p-2'>
                <IconUserPlus className='h-4 w-4 text-emerald-500' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-foreground text-sm font-semibold tracking-tight'>
                  {t('newCustomer')}
                </span>
                <span className='text-muted-foreground truncate text-[10px]'>
                  {t('newCustomerDescription')}
                </span>
              </div>
              <kbd className='text-muted-foreground bg-muted border-border/40 rounded border px-1.5 py-0.5 font-mono text-[9px] select-none'>
                U
              </kbd>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className='bg-border/40 mx-1 hidden h-6 w-px lg:mx-2 lg:block' />
      <NotificationCenter />
    </div>
  );
}
