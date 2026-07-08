'use client';

import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  getMenuItemNavKey,
  useAdminSidebarNav
} from '@/domains/admin/hooks/use-admin-sidebar-nav';
import { cn } from '@/lib/utils';
import type { DtoMenuItemResponse } from '@/services/-user-menu-structure-get.schemas';

import { ICON_MAP } from '../data';

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  if (pathname === href) return true;
  if (href !== '/dashboard' && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function SidebarNavItem({
  item,
  isCollapsed,
  pathname,
  onNavigate
}: {
  item: DtoMenuItemResponse;
  isCollapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const hasChildren = !!(item.children && item.children.length > 0);
  const navKey = getMenuItemNavKey(item);
  const { isExpanded, setExpanded, toggleExpanded } = useAdminSidebarNav();

  const isChildActive =
    hasChildren && item.children?.some((child) => isPathActive(pathname, child.href));
  const isSelfActive = isPathActive(pathname, item.href);
  const isActive = isSelfActive || !!isChildActive;
  const isOpen = isExpanded(navKey, !!isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setExpanded(navKey, true);
    }
  }, [isChildActive, navKey, setExpanded]);

  const itemClasses = cn(
    'dashboard-nav-item group relative outline-none',
    isActive ? 'dashboard-nav-item-active' : '',
    isCollapsed && 'mx-auto h-10 w-10 justify-center px-0'
  );

  const childLinkClasses = (active: boolean) =>
    cn(
      'relative block rounded-lg px-3 py-2 text-xs font-medium transition-all',
      active
        ? 'dashboard-nav-item-active font-semibold'
        : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
    );

  const renderIcon = (iconName?: string, active?: boolean) => {
    const IconComponent = iconName ? ICON_MAP[iconName as keyof typeof ICON_MAP] : null;
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center transition-colors',
          active ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-foreground'
        )}
      >
        {IconComponent ? (
          <IconComponent size={20} strokeWidth={active ? 2.5 : 2} />
        ) : (
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full bg-current transition-all',
              active ? 'scale-125 opacity-100' : 'opacity-30'
            )}
          />
        )}
      </div>
    );
  };

  if (isCollapsed && hasChildren) {
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button className={cn(itemClasses, 'cursor-pointer overflow-visible')}>
                {renderIcon(item.icon, isActive)}
                {isChildActive ? (
                  <div className='bg-primary border-background absolute top-1 right-1 h-2 w-2 rounded-full border-2' />
                ) : null}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={12} className='text-xs font-semibold'>
            {item.label}
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent side='right' sideOffset={12} className='w-56 rounded-xl p-2'>
          <DropdownMenuLabel className='text-muted-foreground px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase'>
            {item.label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.children?.map((child) => {
            const childActive = isPathActive(pathname, child.href);
            return (
              <DropdownMenuItem key={child.href} asChild>
                <Link href={child.href ?? '#'} className={childLinkClasses(!!childActive)}>
                  {child.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (hasChildren && !isCollapsed) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => {
          if (open) setExpanded(navKey, true);
          else toggleExpanded(navKey, !!isChildActive);
        }}
        className='w-full'
      >
        <CollapsibleTrigger asChild>
          <button type='button' className={cn(itemClasses, 'w-full justify-between')}>
            <div className='flex min-w-0 items-center gap-3'>
              {renderIcon(item.icon, isActive)}
              <span className='truncate'>{item.label}</span>
            </div>
            <IconChevronDown
              className={cn(
                'h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
                isOpen && 'text-emerald-400 rotate-180 opacity-100'
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className='border-border/50 mt-1 ml-4 space-y-0.5 border-l pl-3'>
          {item.children?.map((child) => {
            const childActive = isPathActive(pathname, child.href);
            return (
              <Link
                key={child.href}
                href={child.href ?? '#'}
                className={childLinkClasses(!!childActive)}
              >
                {child.label}
              </Link>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={item.href || '#'} className={itemClasses} onClick={onNavigate}>
          {renderIcon(item.icon, isActive)}
          {!isCollapsed ? <span className='flex-1 truncate'>{item.label}</span> : null}
          {isActive && isCollapsed ? (
            <div className='absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400' />
          ) : null}
        </Link>
      </TooltipTrigger>
      {isCollapsed ? (
        <TooltipContent side='right' sideOffset={10} className='text-xs font-semibold'>
          {item.label}
        </TooltipContent>
      ) : null}
    </Tooltip>
  );
}
