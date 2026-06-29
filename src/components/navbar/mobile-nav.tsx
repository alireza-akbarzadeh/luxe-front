'use client';

import { IconArrowRight, IconChevronRight, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Badge } from '@/components/ui/badge';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';
import { cn } from '~/src/lib/utils';

type MobileNavProps = {
  onNavigateAction?: () => void;
  navMenus: DtoNavItemResponse[] | undefined;
};

export function MobileNav({ onNavigateAction, navMenus }: MobileNavProps) {
  const t = useTranslations('nav.mobile');
  const tt = useTranslations('shop.toolbar');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const megaItems = navMenus?.filter((item) => item.type === 'mega');
  const linkItems = navMenus?.filter((item) => item.type === 'link');

  const utilityLinks = [
    { label: t('notifications'), href: '/notifications' },
    { label: t('stores'), href: '/store' },
    { label: t('wishlist'), href: '/wishlist' },
    { label: t('apps'), href: '/apps' },
    { label: t('account'), href: '/account' }
  ] as const;

  const toggleItem = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      <div className='border-border/40 shrink-0 border-b px-5 py-3'>
        <Link
          href='/search'
          onClick={onNavigateAction}
          className='bg-muted/50 text-muted-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm transition-colors'
        >
          <IconSearch className='size-4 shrink-0' stroke={1.75} />
          <span>{tt('searchAriaLabel') ?? 'Search products…'}</span>
        </Link>
      </div>

      <div className='pb-safe min-h-0 flex-1 overflow-y-auto overscroll-contain'>
        <nav className='px-2 pt-2'>
          {megaItems?.map((item) => {
            const isOpen = expandedItem === item.label;
            return (
              <div key={item.label as string}>
                <button
                  type='button'
                  onClick={() => toggleItem(item.label as string)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[15px] font-medium transition-colors',
                    isOpen ? 'text-foreground' : 'text-foreground/90 hover:text-foreground'
                  )}
                  aria-expanded={isOpen}
                >
                  <span>{item.label}</span>
                  <IconChevronRight
                    className={cn(
                      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-90'
                    )}
                    stroke={1.75}
                  />
                </button>

                {/* Accordion panel */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className='bg-muted/30 mx-3 mb-2 rounded-xl px-4 py-4'>
                    <div className='space-y-5'>
                      {item?.columns?.map((column) => (
                        <div key={column.title}>
                          <p className='text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase'>
                            {column.title}
                          </p>
                          <ul className='space-y-0.5'>
                            {column?.links?.map((link) => (
                              <li key={link.title}>
                                <Link
                                  href={link.href as string}
                                  onClick={onNavigateAction}
                                  className='text-foreground/75 hover:text-foreground block rounded-lg px-1 py-2 text-sm transition-colors'
                                >
                                  {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.viewAll && (
                        <Link
                          href={item.viewAll.href as string}
                          onClick={onNavigateAction}
                          className='text-accent inline-flex items-center gap-1 pt-1 text-sm font-medium'
                        >
                          {item.viewAll.label}
                          <IconArrowRight className='cn-rtl-flip size-4' />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Link items */}
        {linkItems && linkItems.length > 0 && (
          <nav className='border-border/40 border-t px-2 pt-2'>
            {linkItems.map((item) => (
              <Link
                key={item.label as string}
                href={item.href as string}
                onClick={onNavigateAction}
                className='hover:text-foreground flex items-center gap-2.5 rounded-xl px-3 py-3.5 text-[15px] font-medium transition-colors'
              >
                {item.label}
                {item.badge && (
                  <Badge variant='destructive' size='sm'>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Utility / MORE section */}
        <div className='border-border/40 border-t px-5 pt-6 pb-8'>
          <p className='text-muted-foreground mb-3 text-[10px] font-semibold tracking-widest uppercase'>
            {t('more')}
          </p>
          <div className='space-y-0.5'>
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigateAction}
                className='text-muted-foreground hover:text-foreground block rounded-lg py-2.5 text-sm transition-colors'
              >
                {link.label}
              </Link>
            ))}
            <Link
              href='/shop'
              onClick={onNavigateAction}
              className='text-accent inline-flex items-center gap-1 pt-2 text-sm font-medium'
            >
              {t('shopAllProducts')}
              <IconArrowRight className='cn-rtl-flip size-4' />
            </Link>
          </div>
          <div className='mt-6'>
            <LanguageSwitcher variant='footer' />
          </div>
        </div>
      </div>
    </div>
  );
}
