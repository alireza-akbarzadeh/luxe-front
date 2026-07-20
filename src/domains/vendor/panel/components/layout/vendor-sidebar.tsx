'use client';

import { AnimatePresence, motion, type Transition } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { logoutAction } from '@/actions/auth.actions';
import { DashboardBrandLogo } from '@/components/dashboard/dashboard-brand-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VendorNavFavoriteButton } from '@/domains/vendor/panel/components/layout/vendor-nav-favorite-button';
import { useVendorNavFavorites } from '@/domains/vendor/panel/hooks/use-vendor-nav-favorites';
import { useVendorPanelNav } from '@/domains/vendor/panel/hooks/use-vendor-panel-nav';
import { resolveVendorFavoriteLinks } from '@/domains/vendor/panel/lib/vendor-nav-utils';
import { VendorNavFavorites } from '@/domains/vendor/panel/sections/vendor-nav-favorites';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import type { VendorNavItem } from '@/domains/vendor/vendor-panel-nav';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';

interface VendorSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function VendorSidebar({ className, onNavigate }: VendorSidebarProps) {
  const t = useTranslations('vendor.panel.shell');
  const { groups, logoutItem } = useVendorPanelNav();
  const favoriteItems = resolveVendorFavoriteLinks(
    useVendorPanelStore((state) => state.favoriteHrefs),
    groups
  );
  const pathname = usePathname();
  const { isMobile } = useMediaDevices();
  const sidebarCollapsed = useVendorPanelStore((s) => s.sidebarCollapsed);
  const effectiveCollapsed = isMobile ? false : sidebarCollapsed;

  const springTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 38,
    mass: 1
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: effectiveCollapsed ? 76 : 260 }}
        transition={springTransition}
        className={cn(
          'dashboard-sidebar relative z-30 flex h-full shrink-0 flex-col border-r',
          className
        )}
      >
        <div className={cn('p-3', effectiveCollapsed ? 'flex justify-center' : 'px-4')}>
          <DashboardBrandLogo
            variant='vendor'
            collapsed={effectiveCollapsed}
            onNavigate={onNavigate}
          />
        </div>

        <Separator className={cn('opacity-30', effectiveCollapsed ? 'mx-auto w-10' : 'mx-3')} />

        <ScrollArea className='flex-1 py-3'>
          <motion.div layout className={cn('space-y-5', effectiveCollapsed ? 'px-1.5' : 'px-2')}>
            <VendorNavFavorites
              items={favoriteItems}
              pathname={pathname}
              collapsed={effectiveCollapsed}
              onNavigate={onNavigate}
            />

            {groups.map((group) => (
              <motion.div key={group.id} layout>
                <AnimatePresence initial={false}>
                  {!effectiveCollapsed ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-muted-foreground mb-1.5 px-3 text-[10px] font-bold tracking-[0.16em] uppercase'
                    >
                      {group.label}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
                <nav className='space-y-0.5' aria-label={group.label}>
                  {group.items.map((item) => (
                    <VendorSidebarLink
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      collapsed={effectiveCollapsed}
                      onNavigate={onNavigate}
                    />
                  ))}
                </nav>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>

        <div className='space-y-1 border-t border-white/8 p-2'>
          <VendorSidebarLink
            item={logoutItem}
            pathname={pathname}
            collapsed={effectiveCollapsed}
            onLogout
            onNavigate={onNavigate}
          />
          {!effectiveCollapsed ? (
            <Button variant='ghost' size='sm' className='w-full justify-start text-xs' asChild>
              <Link href='/vendor' onClick={onNavigate}>
                {t('backToMarketing')}
              </Link>
            </Button>
          ) : null}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

function VendorSidebarLink({
  item,
  pathname,
  collapsed,
  onNavigate,
  onLogout
}: {
  item: VendorNavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  onLogout?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useVendorNavFavorites();
  const isActive =
    item.href === '/vendor/panel' ? pathname === item.href : pathname.startsWith(item.href);

  const content = (
    <>
      <item.icon className='size-4 shrink-0' aria-hidden />
      {!collapsed ? <span className='flex-1 truncate'>{item.label}</span> : null}
      {!collapsed && item.badge ? <span className='dashboard-nav-badge'>{item.badge}</span> : null}
      {!onLogout ? (
        <VendorNavFavoriteButton
          href={item.href}
          label={item.label}
          isCollapsed={collapsed}
          isFavorite={isFavorite}
          onToggle={toggleFavorite}
        />
      ) : null}
    </>
  );

  const className = cn(
    'dashboard-nav-item group',
    collapsed && 'justify-center px-2',
    !collapsed && 'w-full',
    isActive && 'dashboard-nav-item-active'
  );

  if (onLogout) {
    const button = (
      <button
        type='button'
        className={className}
        onClick={() => {
          onNavigate?.();
          void logoutAction();
        }}
      >
        {content}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side='right'>{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return button;
  }

  const link = (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side='right'>{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
