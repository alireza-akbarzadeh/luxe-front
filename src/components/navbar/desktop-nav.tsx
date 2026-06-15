'use client';

import Link from 'next/link';

import { MegaMenuPanel } from '@/components/navbar/mega-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';
import { GlowBadge } from '~/src/components/badges/glow-badge';

import { navSupplementLinks } from './nav-supplement';

const triggerClassName = cn(
  'bg-transparent h-auto px-0 py-0 text-[13px] font-medium xl:text-sm',
  'text-muted-foreground hover:text-foreground hover:bg-transparent',
  'focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground'
);

interface DesktopNavProps {
  navMenus: DtoNavItemResponse[] | undefined;
}

export function DesktopNav(props: DesktopNavProps) {
  const { navMenus } = props;

  return (
    <NavigationMenu className='relative z-10 w-full max-w-full min-w-0 justify-center'>
      <NavigationMenuList className='w-full min-w-0 flex-nowrap justify-center gap-3 space-x-0 xl:gap-4 2xl:gap-5'>
        {navMenus?.map((item) =>
          item.type === 'link' ? (
            <NavigationMenuItem key={item.label} className='shrink-0'>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href as string}
                  className={cn(
                    triggerClassName,
                    'inline-flex items-center gap-1.5 whitespace-nowrap',
                    item.badge && 'text-foreground'
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <GlowBadge size='sm' variant='destructive'>
                      {item.badge}
                    </GlowBadge>
                  )}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.label} className='shrink-0'>
              <NavigationMenuTrigger className={cn(triggerClassName, 'gap-0.5 whitespace-nowrap')}>
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuPanel item={item} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        )}
        {navSupplementLinks.map((link) => (
          <NavigationMenuItem key={link.label} className='hidden shrink-0 2xl:block'>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(triggerClassName, 'inline-flex items-center gap-2 whitespace-nowrap')}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
