'use client';

import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const CALENDAR_RANGES = [
  { href: '/vendor/panel/products', label: 'Last 30 days' },
  { href: '/vendor/panel/discounts', label: 'Last 60 days' },
  { href: '/vendor/panel/marketing', label: 'Last 90 days' },
  { href: '/vendor/panel/inventory', label: 'Last 180 days' },
  { href: '/vendor/panel/team', label: 'Last 365 days' }
] as const;

export function TopNavCalendarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='outline' className='hidden h-9 gap-1 rounded-xl sm:inline-flex'>
          <IconCalendar className='size-4 shrink-0' />
          <span className='hidden md:inline'>Calendar</span>
          <IconChevronDown className='ml-1 size-3 shrink-0 opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        {CALENDAR_RANGES.map((range) => (
          <DropdownMenuItem key={range.href} asChild>
            <Link href={range.href}>{range.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
