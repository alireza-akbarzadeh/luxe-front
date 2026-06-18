'use client';

import { IconMenu, IconSearch, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { sortNavMenuItems } from '@/domains/menus/lib/nav-menu-payload';
import { SearchMobileSheet } from '@/domains/search/components/search-mobile-sheet';
import { useSearchStore } from '@/domains/search/search.store';
import { useGetNavMenus } from '@/services/-nav-menus-get';

import { CartButton } from '../cart/cart-button';
import { CartSheet } from '../cart/cart-sheet';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { NavbarActionButton } from './navbar-action-button';
import { NotificationButton } from './notification-button';
import { UserProfile } from './user/user-profile';
import { WishlistButton } from './wishlist-button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openSearchSheet = useSearchStore((state) => state.openSearchSheet);
  const { data: { data: navMenus } = {} } = useGetNavMenus();
  const sortedNavMenus = navMenus ? sortNavMenuItems(navMenus) : undefined;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-border/50 bg-background/85 border-b shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav className='mx-auto max-w-7xl'>
          <div className='flex h-16 items-center gap-3 lg:grid lg:h-20 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-4 xl:gap-x-6'>
            <Link href='/' className='relative z-20 flex shrink-0 items-center'>
              <motion.span
                className='font-display text-2xl font-semibold tracking-tight'
                whileHover={{ scale: 1.02 }}
              >
                LUXE
              </motion.span>
            </Link>

            <div className='hidden min-w-0 lg:block'>
              <DesktopNav navMenus={sortedNavMenus} />
            </div>

            <div className='ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-0'>
              <NavbarActionButton
                className='lg:hidden'
                aria-label='Search'
                onClick={openSearchSheet}
              >
                <IconSearch className='size-5' stroke={1.75} />
              </NavbarActionButton>

              <NavbarActionButton asChild className='hidden lg:inline-flex'>
                <Link href='/search' aria-label='Search'>
                  <IconSearch className='size-5' stroke={1.75} />
                </Link>
              </NavbarActionButton>

              <WishlistButton />

              <NotificationButton />

              <CartButton />

              <span
                className='bg-border/70 mx-1 hidden h-5 w-px sm:mx-1.5 md:inline-block'
                aria-hidden
              />

              <UserProfile />

              <NavbarActionButton
                className='lg:hidden'
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <IconX className='size-5' stroke={1.75} />
                ) : (
                  <IconMenu className='size-5' stroke={1.75} />
                )}
              </NavbarActionButton>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='border-border bg-background/95 border-b backdrop-blur-xl lg:hidden'
            >
              <div className='navbar-container py-6'>
                <MobileNav
                  navMenus={sortedNavMenus}
                  onNavigateAction={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>
      <CartSheet />
      <SearchMobileSheet />
    </>
  );
}
