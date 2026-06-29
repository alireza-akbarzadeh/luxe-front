'use client';

import { IconWorld } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { setLocale } from '@/actions/locale.actions';
import { NavbarActionButton } from '@/components/navbar/navbar-action-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { type Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'icon' | 'footer';
}

export function LanguageSwitcher({ className, variant = 'icon' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('language');

  const onLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  };

  if (variant === 'footer') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              aria-disabled={isPending}
              aria-label={t('label')}
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex w-full max-w-xs items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <span className='inline-flex items-center gap-2'>
                <IconWorld className='size-6' stroke={1.75} />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-44'>
            <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
              {locales.map((code) => (
                <DropdownMenuRadioItem key={code} value={code}>
                  {t(code)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavbarActionButton className={className} aria-label={t('label')} disabled={isPending}>
          <IconWorld className='size-5' stroke={1.75} />
        </NavbarActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-44'>
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
          {locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {t(code)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
