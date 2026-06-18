import { AnimatePresence, motion, type Transition } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToggleSidebarAction } from '@/domains/admin/components/toggle-sidebar-action';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';
import { AdminSidebarSkeleton } from './admin-sidebar-skeleton';
import { SidebarNavItem } from './sidebar-nav-item';
import { UserProfile } from './user-profile';
import { WorkspaceSwitcher } from './workspace-switcher';

interface AdminSidebarProps {
  groups: DtoMenuGroupResponse[];
  pathname: string;
  className?: string;
  isLoading?: boolean;
}

export function AdminSidebar(props: AdminSidebarProps) {
  const { groups, pathname, className, isLoading = false } = props;
  const { isMobile } = useMediaDevices();
  const isSidebarCollapsed = useDashboardStore((store) => store.isSidebarCollapsed);
  const effectiveCollapsed = isMobile ? false : isSidebarCollapsed;

  const springTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 38,
    mass: 1
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: effectiveCollapsed ? 76 : 280 }}
      transition={springTransition}
      className={cn(
        'bg-card/95 relative z-30 flex h-full shrink-0 flex-col border-r border-border/60',
        'overflow-hidden select-none backdrop-blur-sm',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-1 p-2',
          effectiveCollapsed ? 'flex-col' : 'justify-between'
        )}
      >
        <WorkspaceSwitcher isCollapsed={effectiveCollapsed} />
        <ToggleSidebarAction />
      </div>

      <Separator
        className={cn('opacity-40', effectiveCollapsed ? 'mx-auto mb-3 w-10' : 'mx-4 mb-4 w-auto')}
      />

      <ScrollArea className='w-full flex-1' type='auto'>
        <div
          className={cn('flex flex-col gap-6 pb-8', effectiveCollapsed ? 'items-center px-1' : 'px-2')}
        >
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
                      className='text-muted-foreground/50 mb-2 px-3 text-[10px] font-bold tracking-[0.18em] whitespace-nowrap uppercase'
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
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className='bg-muted/20 mt-auto flex shrink-0 flex-col gap-1 border-t border-border/60 p-2'>
        <UserProfile variant='sidebar' isCollapsed={effectiveCollapsed} />
      </div>
    </motion.aside>
  );
}
