'use client';

import {
  IconBox,
  IconPlus,
  IconSpeakerphone,
  IconTicket,
  IconTruck,
  IconUserPlus
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function TopNavQuickActions() {
  const t = useTranslations('vendor.panel.topNav');

  const actions: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { href: '/vendor/panel/products', label: t('createProduct'), icon: IconBox },
    { href: '/vendor/panel/discounts', label: t('createCoupon'), icon: IconTicket },
    { href: '/vendor/panel/marketing', label: t('createCampaign'), icon: IconSpeakerphone },
    { href: '/vendor/panel/inventory', label: t('addInventory'), icon: IconTruck },
    { href: '/vendor/panel/team', label: t('inviteStaff'), icon: IconUserPlus }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='sm'
          className='bg-gold hover:bg-gold/90 text-gold-foreground hidden h-9 gap-1 rounded-xl shadow-sm sm:inline-flex'
        >
          <IconPlus className='size-4 shrink-0' />
          <span className='hidden md:inline'>{t('quickActions')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        {actions.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className='flex items-center gap-2'>
              <Icon className='text-muted-foreground size-4 shrink-0' />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
