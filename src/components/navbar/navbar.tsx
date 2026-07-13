'use client';

import { IconMenu, IconSearch, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { StorefrontBrandLogo } from '@/components/brand/storefront-brand-logo';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useNavMenus } from '@/domains/menus/hooks/use-nav-menus';
import { sortNavMenuItems } from '@/domains/menus/lib/nav-menu-payload';
import { useSearchStore } from '@/domains/search/search.store';
import { cn } from '@/lib/utils';

import { CartButton } from '../cart/cart-button';
import { AppsButton } from './apps-button';
import { DeliveryLocationButton } from './delivery-location-button';
import { DesktopNav } from './desktop-nav';
import { NavbarActionButton } from './navbar-action-button';
import { NotificationButton } from './notification-button';
import { UserProfile } from './user/user-profile';
import { WishlistButton } from './wishlist-button';

const CartSheet = dynamic(() => import('../cart/cart-sheet').then((m) => m.CartSheet), {
  ssr: false
});

const WishlistSheet = dynamic(
  () => import('../wishlist/wishlist-sheet').then((m) => m.WishlistSheet),
  { ssr: false }
);

const SearchMobileSheet = dynamic(
  () => import('@/domains/search/components/search-mobile-sheet').then((m) => m.SearchMobileSheet),
  { ssr: false }
);
const VisualSearchDialog = dynamic(
  () =>
    import('@/domains/search/components/visual-search-dialog').then((m) => m.VisualSearchDialog),
  { ssr: false }
);

function NavbarVisualSearchDialog() {
  const isSearchSheetOpen = useSearchStore((state) => state.isSearchSheetOpen);
  if (isSearchSheetOpen) return null;
  return <VisualSearchDialog />;
}

const NavbarMobileDrawer = dynamic(
  () => import('./navbar-mobile-drawer').then((m) => m.NavbarMobileDrawer),
  { ssr: false }
);

export function Navbar() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: { data: navMenus } = {} } = useNavMenus();
  const sortedNavMenus = navMenus ? sortNavMenuItems(navMenus) : undefined;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
          isScrolled
            ? 'border-border/50 bg-background/85 border-b shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <nav className='app-container'>
          <div className='mt-2 flex h-16 items-center justify-between gap-3 lg:grid lg:h-20 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-3 xl:gap-x-5'>
            <Link
              href='/'
              aria-label='LUXE Home'
              className='inline-flex shrink-0 items-center lg:col-start-1 lg:justify-self-start'
            >
              <StorefrontBrandLogo variant='compact' />
            </Link>
            <div className='-mt-[13px] hidden min-w-0 lg:col-start-2 lg:block'>
              <DesktopNav navMenus={sortedNavMenus} />
            </div>

            <div className='-mt-[13px] flex shrink-0 items-center gap-0.5 sm:gap-1 lg:col-start-3 lg:justify-self-end'>
              <Link
                href='/search'
                aria-label={t('search')}
                className='border-border/60 bg-card/50 text-muted-foreground hover:border-gold/40 hover:text-foreground me-1 flex hidden h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm backdrop-blur transition-colors lg:inline-flex xl:min-w-40'
              >
                <IconSearch
                  className={cn('size-4', locale === 'fa' ? 'rotate-80 transform' : '')}
                  stroke={1.75}
                />
                <span className='hidden truncate xl:inline'>{t('search')}</span>
              </Link>

              <div className='hidden xl:contents'>
                <DeliveryLocationButton />
                <WishlistButton />
                <AppsButton />
                <NotificationButton />
                <LanguageSwitcher />
                <CartButton />
                <span
                  className='bg-border/70 mx-1 hidden h-5 w-px sm:mx-1.5 md:inline-block'
                  aria-hidden
                />
                <UserProfile />
              </div>

              <div className='hidden lg:contents xl:hidden'>
                <WishlistButton />
                <NotificationButton />
                <CartButton />
                <span className='bg-border/70 mx-1 hidden h-5 w-px md:inline-block' aria-hidden />
                <UserProfile />
              </div>

              <NavbarActionButton
                className='lg:hidden'
                aria-label={isMobileMenuOpen ? tNav('closeMenu') : tNav('openMenu')}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <IconMenu
                  className={cn(
                    'size-5 transition-opacity duration-150',
                    isMobileMenuOpen && 'hidden'
                  )}
                  stroke={1.75}
                  aria-hidden
                />
                <IconX
                  className={cn(
                    'size-5 transition-opacity duration-150',
                    !isMobileMenuOpen && 'hidden'
                  )}
                  stroke={1.75}
                  aria-hidden
                />
              </NavbarActionButton>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen ? (
        <NavbarMobileDrawer navMenus={sortedNavMenus} onClose={closeMenu} />
      ) : null}

      <CartSheet />
      <WishlistSheet />
      <SearchMobileSheet />
      <NavbarVisualSearchDialog />
    </>
  );
}
