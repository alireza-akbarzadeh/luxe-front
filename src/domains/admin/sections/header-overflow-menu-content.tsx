'use client';

import { IconPackage, IconTags, IconTicket, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import ThemeToggle from '@/components/ui/theme-toggle';
import { Text } from '@/components/ui/typography';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { cn } from '@/lib/utils';

interface HeaderOverflowMenuContentProps {
  onClose?: () => void;
  variant?: 'drawer' | 'dropdown';
}

export function HeaderOverflowMenuContent({
  onClose,
  variant = 'dropdown'
}: HeaderOverflowMenuContentProps) {
  const t = useTranslations('adminShell');
  const [period, setPeriod] = useDashboardPeriod();
  const isDrawer = variant === 'drawer';

  const itemClass = cn(
    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isDrawer ? 'hover:bg-muted/50 w-full' : 'cursor-pointer'
  );

  return (
    <div className={cn(isDrawer ? 'px-2 pb-6' : 'p-1')}>
      <div className={cn('sm:hidden', isDrawer ? 'px-2 pb-3' : '')}>
        <Text variant='overline' className='px-1 pb-2'>
          {t('header.period')}
        </Text>
        <div className='flex flex-wrap gap-1.5'>
          {dashboardPeriods.map((option) => (
            <button
              key={option}
              type='button'
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                period === option
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/60 hover:bg-muted/40'
              )}
              onClick={() => {
                void setPeriod(option);
              }}
            >
              {dashboardPeriodLabel(option)}
            </button>
          ))}
        </div>
      </div>

      {!isDrawer ? (
        <>
          <div className='sm:hidden'>
            <div className='bg-border/60 my-1 h-px' />
          </div>
        </>
      ) : (
        <div className='bg-border/60 mx-2 my-3 h-px sm:hidden' />
      )}

      <Text variant='overline' className='px-3 pb-2'>
        {t('quickActions.label')}
      </Text>
      <div className='space-y-0.5 px-1'>
        <QuickLink href='/dashboard/products/create' className={itemClass} onNavigate={onClose}>
          <IconPackage className='size-4' />
          {t('quickActions.newProduct')}
        </QuickLink>
        <QuickLink href='/dashboard/collections/create' className={itemClass} onNavigate={onClose}>
          <IconTags className='size-4' />
          {t('quickActions.newCollection')}
        </QuickLink>
        <QuickLink href='/dashboard/discounts/create' className={itemClass} onNavigate={onClose}>
          <IconTicket className='size-4' />
          {t('quickActions.newDiscount')}
        </QuickLink>
        <QuickLink href='/dashboard/customers/create' className={itemClass} onNavigate={onClose}>
          <IconUserPlus className='size-4' />
          {t('quickActions.newCustomer')}
        </QuickLink>
      </div>

      <div className='bg-border/60 mx-3 my-3 h-px md:hidden' />

      <div className='flex items-center justify-between px-3 py-2 md:hidden'>
        <span className='text-sm'>{t('header.theme')}</span>
        <ThemeToggle variant='ghost' className='h-8 w-8 rounded-lg' />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  className,
  onNavigate,
  children
}: {
  href: string;
  className: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
