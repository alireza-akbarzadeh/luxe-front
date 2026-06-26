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
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { setLocale } from '@/actions/locale.actions';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { FlexItem } from '@/components/ui/flex-item';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ThemeToggle from '@/components/ui/theme-toggle';
import { VENDOR_NOTIFICATIONS } from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { type Locale, locales } from '@/i18n/config';
import { listVendorStores } from '@/lib/api/vendor-stores';
import type { UserPayload } from '@/lib/auth/auth-server';
import { cn } from '@/lib/utils';

const iconButtonClass = 'size-9 shrink-0 rounded-xl';

interface VendorTopNavProps {
  user: UserPayload;
  onOpenMobileNav: () => void;
}

export function VendorTopNav({ user, onOpenMobileNav }: VendorTopNavProps) {
  const t = useTranslations('vendor.panel.topNav');
  const tLang = useTranslations('language');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isLocalePending, startLocaleTransition] = useTransition();
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);
  const toggleSidebarCollapsed = useVendorPanelStore((s) => s.toggleSidebarCollapsed);
  const sidebarCollapsed = useVendorPanelStore((s) => s.sidebarCollapsed);
  const activeStoreName = useVendorPanelStore((s) => s.activeStoreName);
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const setActiveStore = useVendorPanelStore((s) => s.setActiveStore);

  const { data: storesData } = useQuery({
    queryKey: ['vendor-stores'],
    queryFn: listVendorStores
  });
  const vendorStores = storesData?.data ?? [];

  const unreadCount = VENDOR_NOTIFICATIONS.filter((n) => !n.read).length;
  const userInitials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`;

  const onLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    startLocaleTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  };

  return (
    <header className='border-border/60 bg-background/80 sticky top-0 z-20 shrink-0 border-b backdrop-blur-xl'>
      <Flex
        direction='row'
        align='center'
        spacing={2}
        fullWidth
        className='h-14 px-3 md:h-16 md:gap-3 md:px-4'
      >
        <Flex direction='row' align='center' spacing={1} shrink>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={cn(iconButtonClass, 'md:hidden')}
            aria-label={t('openNavigation')}
            onClick={onOpenMobileNav}
          >
            <IconMenu className='size-5' />
          </Button>

          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={cn(iconButtonClass, 'hidden md:inline-flex')}
            aria-label={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            onClick={toggleSidebarCollapsed}
          >
            {sidebarCollapsed ? (
              <IconLayoutSidebarLeftExpand className='size-5' />
            ) : (
              <IconLayoutSidebarLeftCollapse className='size-5' />
            )}
          </Button>
        </Flex>

        <FlexItem grow={1} className='min-w-0'>
          <button
            type='button'
            onClick={() => setCommandOpen(true)}
            className='border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50 flex h-9 w-full items-center gap-2 rounded-xl border px-3 text-sm transition-colors md:max-w-md'
            aria-label={t('openSearch')}
          >
            <IconSearch className='size-4 shrink-0' />
            <span className='truncate'>{t('searchPlaceholder')}</span>
            <kbd className='bg-background ms-auto hidden rounded border px-1.5 py-0.5 text-[10px] md:inline'>
              ⌘K
            </kbd>
          </button>
        </FlexItem>

        <Flex direction='row' align='center' spacing={2} shrink className='ms-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='hidden h-9 gap-1 rounded-xl lg:inline-flex'
              >
                <span className='max-w-32 truncate'>{activeStoreName}</span>
                <IconChevronDown className='size-3.5 shrink-0 opacity-60' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>{t('switchStore')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {vendorStores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setActiveStore(store)}
                  className={cn(activeStoreId === store.id && 'bg-accent')}
                >
                  {store.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' className='hidden h-9 gap-1 rounded-xl sm:inline-flex'>
                <IconPlus className='size-4 shrink-0' />
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

          <Flex
            direction='row'
            align='center'
            spacing={0.5}
            className='border-border/60 bg-muted/20 rounded-xl border p-0.5'
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className={cn(iconButtonClass, 'relative')}
                  aria-label={t('notifications')}
                >
                  <IconBell className='size-[18px]' />
                  {unreadCount > 0 ? (
                    <span className='bg-gold text-gold-foreground absolute end-1 top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium'>
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

            <Button variant='ghost' size='icon' className={iconButtonClass} asChild>
              <Link href='/vendor/panel/messages' aria-label={t('messages')}>
                <IconMessage className='size-[18px]' />
              </Link>
            </Button>

            <LanguageSwitcher className={iconButtonClass} />

            <ThemeToggle variant='ghost' className={iconButtonClass} />
          </Flex>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='h-9 max-w-[9.5rem] gap-2 rounded-xl px-2'
              >
                <span className='bg-gold/15 text-gold flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold'>
                  {userInitials}
                </span>
                <span className='hidden min-w-0 truncate text-sm font-medium md:inline'>
                  {user.first_name}
                </span>
                <IconChevronDown className='hidden size-3.5 shrink-0 opacity-60 md:inline' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='space-y-1'>
                <p className='font-medium'>
                  {user.first_name} {user.last_name}
                </p>
                <p className='text-muted-foreground truncate text-xs font-normal' dir='ltr'>
                  {user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                {tLang('label')}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
                {locales.map((code) => (
                  <DropdownMenuRadioItem key={code} value={code} disabled={isLocalePending}>
                    {tLang(code)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/vendor/panel/account'>{t('accountSettings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/vendor/panel/store'>{t('storeSettings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/vendor'>{t('vendorHome')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </Flex>
    </header>
  );
}
