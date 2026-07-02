'use client';

import { IconHeart, IconHome, IconSearch, IconShoppingBag, IconUser } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/components/providers/auth-provider';
import { useSearchStore } from '@/domains/search/search.store';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import { useGetAccountSummary } from '@/services/-account-summary-get';
import { useCartStore } from '@/store/card.store';
import { useProfileDrawerStore } from '@/stores/profile-drawer-store';

type TabId = 'home' | 'search' | 'cart' | 'wishlist' | 'account';

function isTabActive(pathname: string, tab: TabId, isProfileDrawerOpen: boolean) {
  switch (tab) {
    case 'home':
      return pathname === '/';
    case 'search':
      return pathname.startsWith('/search');
    case 'cart':
      return pathname.startsWith('/cart') || pathname.startsWith('/checkout');
    case 'wishlist':
      return pathname.startsWith('/wishlist');
    case 'account':
      return isProfileDrawerOpen || pathname.startsWith('/account') || pathname.startsWith('/auth');
    default:
      return false;
  }
}

/** Fixed bottom tab bar for storefront mobile — native app pattern. */
export function MobileBottomNav() {
  const t = useTranslations('nav.bottomNav');
  const pathname = usePathname();
  const openSearchSheet = useSearchStore((state) => state.openSearchSheet);
  const openCart = useCartStore((state) => state.openCart);
  const { itemCount: cartCount } = useCartController();
  const { isAuthenticated } = useAuth();
  const { data: summaryResponse } = useGetAccountSummary({
    query: { enabled: isAuthenticated }
  });
  const wishlistCount = summaryResponse?.data?.liked_products_count ?? 0;
  const openProfileDrawer = useProfileDrawerStore((state) => state.openProfileDrawer);
  const isProfileDrawerOpen = useProfileDrawerStore((state) => state.isOpen);

  const tabs: Array<{
    id: TabId;
    label: string;
    href?: string;
    onClick?: () => void;
    badge?: number;
    icon: typeof IconHome;
  }> = [
    { id: 'home', label: t('home'), href: '/', icon: IconHome },
    { id: 'search', label: t('search'), onClick: openSearchSheet, icon: IconSearch },
    {
      id: 'cart',
      label: t('cart'),
      onClick: openCart,
      badge: cartCount,
      icon: IconShoppingBag
    },
    {
      id: 'wishlist',
      label: t('wishlist'),
      href: '/wishlist',
      badge: isAuthenticated ? wishlistCount : 0,
      icon: IconHeart
    },
    { id: 'account', label: t('account'), onClick: openProfileDrawer, icon: IconUser }
  ];

  return (
    <nav
      className='border-border/60 bg-background/92 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-xl lg:hidden'
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
      aria-label={t('ariaLabel')}
    >
      <div className='mx-auto flex h-16 max-w-lg items-stretch justify-around px-1'>
        {tabs.map(({ id, label, href, onClick, badge, icon: Icon }) => {
          const active = isTabActive(pathname, id, isProfileDrawerOpen);
          const content = (
            <>
              <span className='relative flex h-6 w-6 items-center justify-center'>
                <Icon className='size-[22px]' stroke={active ? 2.25 : 1.75} />
                <AnimatePresence mode='popLayout'>
                  {badge && badge > 0 ? (
                    <motion.span
                      layout
                      className='bg-gold text-gold-foreground ring-background absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[9px] font-bold ring-2'
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      {badge > 99 ? '99+' : badge}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
              <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>
                {label}
              </span>
            </>
          );

          const className = cn(
            'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 transition-colors',
            active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          );

          if (href) {
            return (
              <Link
                key={id}
                href={href}
                className={className}
                aria-current={active ? 'page' : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button key={id} type='button' onClick={onClick} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
