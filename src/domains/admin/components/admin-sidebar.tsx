import { IconChevronLeft, IconSearch } from '@tabler/icons-react';
import { motion, type Transition } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { DtoMenuGroupResponse } from '@/services/-user-menu-structure-get.schemas';

import { useDashboardStore } from '../admin.store';
import { SidebarNavItem } from './sidebar-nav-item';
import { UserProfile } from './user-profile';
import { WorkspaceSwitcher } from './worksapce-switcher';

export function AdminSidebar({
  groups,
  pathname,
  isMobile = false,
  className
}: {
  groups: DtoMenuGroupResponse[];
  pathname: string;
  isMobile?: boolean;
  className?: string;
}) {
  const { setSearchOpen, isSidebarCollapsed, setSidebarCollapsed } = useDashboardStore();

  const effectiveCollapsed = isMobile ? false : isSidebarCollapsed;
  const springTransition: Transition = {
    type: 'spring',
    stiffness: 380,
    damping: 35
  };
  return (
    <motion.aside
      initial={false}
      animate={{ width: effectiveCollapsed ? 76 : 280 }}
      transition={springTransition}
      className={cn(
        'bg-card/50 relative z-30 flex h-full shrink-0 flex-col border-r backdrop-blur-md',
        'overflow-visible',
        className
      )}
    >
      {/* 1. Workspace Switcher - Pinned at Top */}
      <div className='shrink-0 p-2'>
        <WorkspaceSwitcher isCollapsed={effectiveCollapsed} />
      </div>

      {/* 2. Header & Collapse Toggle */}
      <div className='flex h-12 shrink-0 items-center justify-between overflow-hidden px-4'>
        {!effectiveCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-muted-foreground/50 pl-2 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase'
          >
            Management
          </motion.span>
        )}

        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'hover:bg-primary/10 h-7 w-7 transition-all',
            effectiveCollapsed ? 'mx-auto' : 'ml-auto'
          )}
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          <IconChevronLeft
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform',
              effectiveCollapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* 3. Quick Search - Powered by TanStack Store */}
      <div className='mb-4 shrink-0 px-3'>
        <Button
          variant='outline'
          size='lg'
          className={cn(
            'bg-muted/30 hover:bg-muted/50 text-muted-foreground rounded-sm! border-none shadow-inner transition-all',
            effectiveCollapsed
              ? 'mx-auto h-10 w-10 justify-center rounded-xl p-0'
              : 'w-full justify-start gap-2 rounded-xl'
          )}
          onClick={() => setSearchOpen(true)}
        >
          <IconSearch className='h-4 w-4 shrink-0' />
          {!effectiveCollapsed && <span className='text-xs font-medium'>Quick Search...</span>}
          {!effectiveCollapsed && (
            <kbd className='bg-background pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
              ⌘K
            </kbd>
          )}
        </Button>
      </div>

      <Separator
        className={cn('mb-4 opacity-50', effectiveCollapsed ? 'mx-auto w-10' : 'mx-4 w-auto')}
      />

      {/* 4. Main Navigation Area */}
      <ScrollArea className='w-full flex-1' type='auto'>
        <div
          className={cn(
            'flex flex-col gap-8 pb-10 transition-all duration-300',
            effectiveCollapsed ? 'items-center' : 'px-3'
          )}
        >
          {groups.map((group) => (
            <div key={group.id} className='w-full space-y-1'>
              {!effectiveCollapsed && (
                <h4 className='text-muted-foreground/40 mb-2 px-3 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase'>
                  {group.name}
                </h4>
              )}
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

      {/* 5. Bottom Pinned Section (System Health + Profile) */}
      <div className='bg-card/80 mt-auto flex shrink-0 flex-col gap-1 border-t p-2'>
        <UserProfile variant='sidebar' isCollapsed={effectiveCollapsed} />
      </div>
    </motion.aside>
  );
}
