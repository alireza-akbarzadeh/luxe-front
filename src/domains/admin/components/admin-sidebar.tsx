import { AnimatePresence, motion, type Transition } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToggleSidebarAction } from '@/domains/admin/components/toggle-sidebar-action';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';
import { SidebarNavItem } from './sidebar-nav-item';
import { UserProfile } from './user-profile';
import { WorkspaceSwitcher } from './workspace-switcher';

interface AdminSidebarProps {
  groups: DtoMenuGroupResponse[];
  pathname: string;
  className?: string;
}

export function AdminSidebar(props: AdminSidebarProps) {
  const { groups, pathname, className } = props;
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
        'bg-card relative z-30 flex h-full shrink-0 flex-col border-r',
        'overflow-hidden select-none',
        className
      )}
    >
      {/* 1. Workspace Switcher - Pinned at Top */}
      <div className='flex shrink-0 items-center p-2'>
        <WorkspaceSwitcher isCollapsed={effectiveCollapsed} />
        {!isSidebarCollapsed && <ToggleSidebarAction />}
      </div>

      <Separator
        className={cn('mb-4 opacity-50', effectiveCollapsed ? 'mx-auto w-10' : 'mx-4 w-auto')}
      />

      {/* 4. Main Navigation Area */}
      <ScrollArea className='w-full flex-1' type='auto'>
        {/* FIX: Removed transition-all duration-300 completely to prevent thread conflicts */}
        <div
          className={cn('flex flex-col gap-8 pb-10', effectiveCollapsed ? 'items-center' : 'px-3')}
        >
          {isSidebarCollapsed && <ToggleSidebarAction />}
          {groups.map((group) => (
            <div key={group.id} className='w-full space-y-1'>
              <AnimatePresence initial={false}>
                {!effectiveCollapsed && (
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className='text-muted-foreground/40 mb-2 px-3 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase'
                  >
                    {group.name}
                  </motion.h4>
                )}
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
          ))}
        </div>
      </ScrollArea>

      {/* 5. Bottom Pinned Section */}
      <div className='bg-card mt-auto flex shrink-0 flex-col gap-1 border-t p-2'>
        <UserProfile variant='sidebar' isCollapsed={effectiveCollapsed} />
      </div>
    </motion.aside>
  );
}
