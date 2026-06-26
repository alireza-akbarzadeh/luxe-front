'use client';

import { AnimatePresence, motion, type Transition } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { logoutAction } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVendorPanelNav } from '@/domains/vendor/panel/hooks/use-vendor-panel-nav';
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
        animate={{ width: effectiveCollapsed ? 76 : 272 }}
        transition={springTransition}
        className={cn(
          'bg-card/95 border-border/60 relative z-30 flex h-full shrink-0 flex-col border-r backdrop-blur-sm',
          className
        )}
      >
        <div
          className={cn(
            'p-3',
            effectiveCollapsed ? 'flex flex-col items-center gap-2' : 'px-4 py-3'
          )}
        >
          <Link href='/vendor/panel' className='block min-w-0' onClick={onNavigate}>
            {effectiveCollapsed ? (
              <span className='text-gold text-lg font-bold'>L</span>
            ) : (
              <>
                <p className='text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase'>
                  {t('brandEyebrow')}
                </p>
                <p className='text-foreground mt-0.5 truncate text-sm font-semibold tracking-tight'>
                  {t('brandTitle')}
                </p>
              </>
            )}
          </Link>
        </div>

        <Separator className={cn('opacity-40', effectiveCollapsed ? 'mx-auto w-10' : 'mx-3')} />

        <ScrollArea className='flex-1 py-3'>
          <div className={cn('space-y-5', effectiveCollapsed ? 'px-1.5' : 'px-2')}>
            {groups.map((group) => (
              <div key={group.id}>
                <AnimatePresence initial={false}>
                  {!effectiveCollapsed ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-muted-foreground/60 mb-1.5 px-3 text-[10px] font-bold tracking-[0.16em] uppercase'
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
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='border-border/60 space-y-1 border-t p-2'>
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
  const isActive =
    item.href === '/vendor/panel' ? pathname === item.href : pathname.startsWith(item.href);

  const content = (
    <>
      <item.icon className='size-4 shrink-0' aria-hidden />
      {!collapsed ? <span className='truncate'>{item.label}</span> : null}
      {!collapsed && item.badge ? (
        <Badge variant='secondary' className='ml-auto rounded-full px-1.5 text-[10px]'>
          {item.badge}
        </Badge>
      ) : null}
    </>
  );

  const className = cn(
    'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
    collapsed && 'justify-center px-2',
    isActive
      ? 'bg-accent text-accent-foreground font-medium'
      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
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
