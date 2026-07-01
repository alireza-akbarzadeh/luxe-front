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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            disabled={isPending}
            aria-label={t('label')}
            className={cn(
              'border-border/60 bg-background hover:bg-muted/60 inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition',
              className
            )}
          >
            <IconWorld className='size-6' stroke={1.75} aria-hidden />
          </button>
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
