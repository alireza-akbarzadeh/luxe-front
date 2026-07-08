'use client';

import { IconMenu, IconSearch, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useNavMenus } from '@/domains/menus/hooks/use-nav-menus';
import { sortNavMenuItems } from '@/domains/menus/lib/nav-menu-payload';
import { useSearchStore } from '@/domains/search/search.store';
import { BRAND_ASSETS } from '@/lib/brand-assets';
import { cn } from '@/lib/utils';
import { AppImage } from '~/src/components/ui/app-image';

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
          <div className='mt-2 flex h-16 items-center gap-2 lg:grid lg:h-20 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-3 xl:gap-x-5'>
            <Link
              href='/'
              aria-label='LUXE Home'
              className='relative z-20 inline-flex min-h-11 items-center rtl:flex-row-reverse'
            >
              <AppImage src={BRAND_ASSETS.logo} alt='LUXE' width={200} height={200} />
            </Link>

            <div className='-mt-[13px] hidden min-w-0 lg:block'>
              <DesktopNav navMenus={sortedNavMenus} />
            </div>

            <div className='-mt-[13px] ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-0'>
              <Link href='/search' aria-label={t('search')}>
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
      <SearchMobileSheet />
      <NavbarVisualSearchDialog />
    </>
  );
}
