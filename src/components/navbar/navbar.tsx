'use client';

import { IconMenu, IconSearch, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useNavMenus } from '@/domains/menus/hooks/use-nav-menus';
import { sortNavMenuItems } from '@/domains/menus/lib/nav-menu-payload';
import { SearchMobileSheet } from '@/domains/search/components/search-mobile-sheet';
import { cn } from '~/src/lib/utils';

import { CartButton } from '../cart/cart-button';
import { CartSheet } from '../cart/cart-sheet';
import { AppsButton } from './apps-button';
import { DeliveryLocationButton } from './delivery-location-button';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { NavbarActionButton } from './navbar-action-button';
import { NotificationButton } from './notification-button';
import { UserProfile } from './user/user-profile';
import { WishlistButton } from './wishlist-button';

// Height of the fixed navbar bar in px — used to size the drawer correctly.
const NAVBAR_HEIGHT = 64; // h-16 = 4rem = 64px

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open so only the drawer scrolls.
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
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          isScrolled
            ? 'border-border/50 bg-background/85 border-b shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        {/* ── Top bar ─────────────────────────────────────── */}
        <nav className='mx-auto max-w-7xl'>
          <div className='flex h-16 items-center gap-3 lg:grid lg:h-20 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-4 xl:gap-x-6'>
            {/* Logo */}
            <Link
              href='/'
              aria-label='LUXE Home'
              className='relative z-20 inline-flex min-h-11 items-center px-4 rtl:flex-row-reverse'
            >
              <span className='font-display text-2xl font-semibold tracking-tight'>LUXE</span>
            </Link>

            {/* Desktop nav */}
            <div className='hidden min-w-0 lg:block'>
              <DesktopNav navMenus={sortedNavMenus} />
            </div>

            {/* Right actions */}
            <div className='ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-0'>
              <NavbarActionButton asChild className='hidden lg:inline-flex'>
                <Link href='/search' aria-label={t('search')}>
                  <IconSearch
                    className={cn('size-5', locale === 'fa' ? 'rotate-80 transform' : '')}
                    stroke={1.75}
                  />
                </Link>
              </NavbarActionButton>

              <div className='hidden lg:contents'>
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

              {/* Mobile hamburger */}
              <NavbarActionButton
                className='lg:hidden'
                aria-label={isMobileMenuOpen ? tNav('closeMenu') : tNav('openMenu')}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <AnimatePresence mode='wait' initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key='close'
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <IconX className='size-5' stroke={1.75} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key='menu'
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <IconMenu className='size-5' stroke={1.75} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavbarActionButton>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer + backdrop ─────────────────────────── */}
      {/*
        The drawer sits in a portal-like fixed container that starts exactly
        below the navbar and fills the rest of the viewport height.
        Only the MobileNav content scrolls; the page behind is locked.
      */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden'
              style={{ top: NAVBAR_HEIGHT }}
              onClick={closeMenu}
              aria-hidden
            />

            {/* Drawer panel */}
            <motion.div
              key='drawer'
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
              className='bg-background fixed bottom-0 left-0 z-50 w-[min(88vw,360px)] lg:hidden'
              style={{ top: NAVBAR_HEIGHT }}
              aria-label={tNav('mobileMenu') ?? 'Navigation menu'}
              role='dialog'
              aria-modal='true'
            >
              <MobileNav navMenus={sortedNavMenus} onNavigateAction={closeMenu} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartSheet />
      <SearchMobileSheet />
    </>
  );
}
