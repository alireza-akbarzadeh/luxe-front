import { AnimatePresence, motion, type Transition } from 'framer-motion';

import { DashboardBrandLogo } from '@/components/dashboard/dashboard-brand-logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToggleSidebarAction } from '@/domains/admin/components/toggle-sidebar-action';
import { useAdminNavPreferences } from '@/domains/admin/hooks/use-admin-nav-preferences';
import { resolveFavoriteLinks } from '@/domains/admin/lib/admin-nav-utils';
import { AdminNavFavorites } from '@/domains/admin/sections/admin-nav-favorites';
import { AdminNavRecent } from '@/domains/admin/sections/admin-nav-recent';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { AdminSidebarSkeleton } from './admin-sidebar-skeleton';
import { SidebarNavItem } from './sidebar-nav-item';

interface AdminSidebarProps {
  groups: DtoMenuGroupResponse[];
  pathname: string;
  className?: string;
  isLoading?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar(props: AdminSidebarProps) {
  const { groups, pathname, className, isLoading = false, onNavigate } = props;
  const { isMobile } = useMediaDevices();
  const isSidebarCollapsed = useAdminShellStore((store) => store.isSidebarCollapsed);
  const effectiveCollapsed = isMobile ? false : isSidebarCollapsed;
  const { favorites, recent } = useAdminNavPreferences();
  const favoriteLinks = resolveFavoriteLinks(favorites, groups);

  const springTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 38,
    mass: 1
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: effectiveCollapsed ? 76 : 260 }}
      transition={springTransition}
      className={cn(
        'dashboard-sidebar relative z-30 flex h-full shrink-0 flex-col border-r',
        'overflow-hidden select-none',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-1 p-3',
          effectiveCollapsed ? 'flex-col gap-2' : 'justify-between'
        )}
      >
        <DashboardBrandLogo
          variant='admin'
          collapsed={effectiveCollapsed}
          onNavigate={onNavigate}
        />
        <ToggleSidebarAction />
      </div>

      <Separator className={cn('opacity-30', effectiveCollapsed ? 'mx-auto w-10' : 'mx-3')} />

      <ScrollArea className='w-full flex-1' type='auto'>
        <div
          className={cn(
            'flex flex-col gap-5 pt-2 pb-6',
            effectiveCollapsed ? 'items-center px-1' : 'px-2'
          )}
        >
          <AdminNavFavorites
            items={favoriteLinks}
            isCollapsed={effectiveCollapsed}
            pathname={pathname}
            onNavigate={onNavigate}
          />
          <AdminNavRecent items={recent} isCollapsed={effectiveCollapsed} onNavigate={onNavigate} />

          {isLoading && groups.length === 0 ? (
            <AdminSidebarSkeleton isCollapsed={effectiveCollapsed} />
          ) : (
            groups.map((group) => (
              <div key={group.id} className='w-full space-y-1'>
                <AnimatePresence initial={false}>
                  {!effectiveCollapsed ? (
                    <motion.h4
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className='text-muted-foreground mb-1.5 px-3 text-[10px] font-bold tracking-[0.16em] whitespace-nowrap uppercase'
                    >
                      {group.name}
                    </motion.h4>
                  ) : null}
                </AnimatePresence>
                <div className='space-y-0.5'>
                  {group?.items?.map((item) => (
                    <SidebarNavItem
                      key={item.label}
                      item={item}
                      isCollapsed={effectiveCollapsed}
                      pathname={pathname}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
