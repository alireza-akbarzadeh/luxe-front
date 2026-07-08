'use client';

import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { setLocale } from '@/actions/locale.actions';
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
import { type Locale, locales } from '@/i18n/config';
import type { UserPayload } from '@/lib/auth/auth-server';
import { cn } from '@/lib/utils';
import { AppImage } from '~/src/components/ui/app-image';

interface TopNavUserMenuProps {
  user: UserPayload;
  isOnline: boolean;
}

export function TopNavUserMenu({ user, isOnline }: TopNavUserMenuProps) {
  const t = useTranslations('vendor.panel.topNav');
  const tLang = useTranslations('language');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isLocalePending, startLocaleTransition] = useTransition();

  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    `${user.first_name} ${user.last_name}`
  )}&backgroundColor=d4af37&textColor=ffffff`;

  const onLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    startLocaleTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='hover:bg-white/5 h-9 max-w-[11rem] gap-2 rounded-xl px-2'>
          <span className='relative size-7 shrink-0'>
            <AppImage
              src={avatarUrl}
              alt={`${user.first_name} ${user.last_name}`}
              fill
              sizes='28px'
              className='ring-border/60 rounded-full object-cover ring-1'
              unoptimized
            />
            <span
              className={cn(
                'border-background absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2',
                isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/50'
              )}
            >
              {isOnline && (
                <span className='absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75' />
              )}
            </span>
          </span>

          <span className='hidden min-w-0 truncate text-sm font-medium md:inline'>
            {user.first_name}
          </span>
          <span className='text-muted-foreground hidden text-[11px] md:inline'>Vendor</span>
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
  );
}
