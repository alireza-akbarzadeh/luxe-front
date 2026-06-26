'use client';

import {
  IconBell,
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu,
  IconMessage,
  IconPlus,
  IconSearch
} from '@tabler/icons-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ThemeToggle from '@/components/ui/theme-toggle';
import {
  VENDOR_NOTIFICATIONS,
  VENDOR_STORES
} from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import type { UserPayload } from '@/lib/auth/auth-server';
import { cn } from '@/lib/utils';

interface VendorTopNavProps {
  user: UserPayload;
  onOpenMobileNav: () => void;
}

export function VendorTopNav({ user, onOpenMobileNav }: VendorTopNavProps) {
  const t = useTranslations('vendor.panel.topNav');
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);
  const toggleSidebarCollapsed = useVendorPanelStore((s) => s.toggleSidebarCollapsed);
  const sidebarCollapsed = useVendorPanelStore((s) => s.sidebarCollapsed);
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);
  const setActiveStore = useVendorPanelStore((s) => s.setActiveStore);

  const unreadCount = VENDOR_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className='border-border/60 bg-background/80 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur-xl md:h-16 md:gap-3 md:px-4'>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='md:hidden'
        aria-label={t('openNavigation')}
        onClick={onOpenMobileNav}
      >
        <IconMenu className='size-5' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='hidden md:inline-flex'
        aria-label={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
        onClick={toggleSidebarCollapsed}
      >
        {sidebarCollapsed ? (
          <IconLayoutSidebarLeftExpand className='size-5' />
        ) : (
          <IconLayoutSidebarLeftCollapse className='size-5' />
        )}
      </Button>

      <button
        type='button'
        onClick={() => setCommandOpen(true)}
        className='border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 text-sm transition-colors md:max-w-md'
        aria-label={t('openSearch')}
      >
        <IconSearch className='size-4 shrink-0' />
        <span className='truncate'>{t('searchPlaceholder')}</span>
        <kbd className='bg-background ml-auto hidden rounded border px-1.5 py-0.5 text-[10px] md:inline'>
          ⌘K
        </kbd>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='hidden gap-1 rounded-xl lg:inline-flex'>
            <span className='max-w-32 truncate'>{activeStoreName}</span>
            <IconChevronDown className='size-3.5 opacity-60' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel>{t('switchStore')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {VENDOR_STORES.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => setActiveStore(store)}
              className={cn(activeStoreName === store.name && 'bg-accent')}
            >
              {store.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm' className='hidden gap-1 rounded-xl sm:inline-flex'>
            <IconPlus className='size-4' />
            <span className='hidden md:inline'>{t('quickActions')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/products'>{t('createProduct')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/discounts'>{t('createCoupon')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/marketing'>{t('createCampaign')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/inventory'>{t('addInventory')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/team'>{t('inviteStaff')}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='relative rounded-xl'
            aria-label={t('notifications')}
          >
            <IconBell className='size-5' />
            {unreadCount > 0 ? (
              <span className='bg-gold text-gold-foreground absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-medium'>
                {unreadCount}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-80 p-0'>
          <div className='border-b px-4 py-3'>
            <p className='text-sm font-semibold'>{t('notifications')}</p>
          </div>
          <ul className='max-h-80 overflow-y-auto'>
            {VENDOR_NOTIFICATIONS.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  'border-b px-4 py-3 last:border-0',
                  !notification.read && 'bg-muted/30'
                )}
              >
                <p className='text-sm font-medium'>{notification.title}</p>
                <p className='text-muted-foreground mt-0.5 text-xs'>{notification.body}</p>
                <p className='text-muted-foreground mt-1 text-[10px]'>{notification.time}</p>
              </li>
            ))}
          </ul>
          <div className='border-t p-2'>
            <Button variant='ghost' size='sm' className='w-full' asChild>
              <Link href='/vendor/panel/notifications'>{t('viewAllNotifications')}</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant='ghost' size='icon' className='rounded-xl' asChild>
        <Link href='/vendor/panel/messages' aria-label={t('messages')}>
          <IconMessage className='size-5' />
        </Link>
      </Button>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='gap-2 rounded-xl pl-2'>
            <span className='bg-gold/15 text-gold flex size-8 items-center justify-center rounded-full text-xs font-semibold'>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
            <span className='hidden max-w-24 truncate text-sm font-medium md:inline'>
              {user.first_name}
            </span>
            <IconChevronDown className='hidden size-3.5 opacity-60 md:inline' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuLabel>
            <p className='font-medium'>
              {user.first_name} {user.last_name}
            </p>
            <p className='text-muted-foreground truncate text-xs font-normal'>{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/account'>{t('accountSettings')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor/panel/store'>{t('storeSettings')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/vendor'>{t('vendorHome')}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
