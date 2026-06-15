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
  'bg-transparent h-auto px-0 py-0 text-sm font-medium',
  'text-muted-foreground hover:text-foreground hover:bg-transparent',
  'focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground'
);
interface DesktopNavProps {
  navMenus: DtoNavItemResponse[] | undefined;
}

export function DesktopNav(props: DesktopNavProps) {
  const { navMenus } = props;
  return (
    <NavigationMenu className='max-w-none flex-none justify-start'>
      <NavigationMenuList className='gap-6 space-x-0'>
        {navMenus?.map((item) =>
          item.type === 'link' ? (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href as string}
                  className={cn(
                    triggerClassName,
                    'inline-flex items-center gap-2',
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
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger className={triggerClassName}>
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <MegaMenuPanel item={item} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        )}
        {navSupplementLinks.map((link) => (
          <NavigationMenuItem key={link.label}>
            <NavigationMenuLink asChild>
              <Link href={link.href} className={cn(triggerClassName, 'inline-flex items-center gap-2')}>
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
