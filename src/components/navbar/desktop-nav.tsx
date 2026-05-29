'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { type NavMegaMenu,navMenuItems } from '@/lib/nav-menu-data';
import { cn } from '@/lib/utils';

const triggerClassName = cn(
  'bg-transparent h-auto px-0 py-0 text-sm font-medium',
  'text-muted-foreground hover:text-foreground hover:bg-transparent',
  'focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground'
);

function MegaMenuPanel({ item }: { item: NavMegaMenu }) {
  const columnCount = item.columns.length;
  const hasFeatured = (item.featured?.length ?? 0) > 0;

  return (
    <div className={cn('w-full', hasFeatured ? 'md:w-[820px]' : 'md:w-[640px]')}>
      <div className='flex gap-6 p-6'>
        <div
          className={cn(
            'grid flex-1 gap-8',
            columnCount === 2 && 'grid-cols-2',
            columnCount === 3 && 'grid-cols-3',
            columnCount >= 4 && 'grid-cols-2 lg:grid-cols-4'
          )}
        >
          {item.columns.map((column) => (
            <div key={column.title} className='space-y-3'>
              <p className='text-foreground text-xs font-semibold tracking-wider uppercase'>
                {column.title}
              </p>
              <ul className='space-y-1'>
                {column.links.map((link) => (
                  <li key={link.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className='text-muted-foreground hover:text-foreground block rounded-md py-1.5 text-sm transition-colors outline-none'
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {hasFeatured && item.featured && (
          <aside className='hidden w-[180px] shrink-0 sm:block'>
            {item.featured.map((card) => (
              <NavigationMenuLink key={card.title} asChild>
                <Link
                  href={card.href}
                  className='group bg-muted/40 hover:bg-muted/70 relative block overflow-hidden rounded-xl outline-none transition-colors'
                >
                  <div className='relative aspect-[4/5] w-full'>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      sizes='180px'
                    />
                    <div className='from-foreground/70 absolute inset-0 bg-gradient-to-t to-transparent' />
                    {card.badge && (
                      <Badge className='absolute top-3 left-3' variant='secondary'>
                        {card.badge}
                      </Badge>
                    )}
                    <div className='absolute right-0 bottom-0 left-0 p-4'>
                      <p className='text-primary-foreground text-sm font-semibold'>{card.title}</p>
                      <p className='text-primary-foreground/80 text-xs'>{card.description}</p>
                    </div>
                  </div>
                </Link>
              </NavigationMenuLink>
            ))}
          </aside>
        )}
      </div>

      {item.viewAll && (
        <div className='border-border border-t px-6 py-3'>
          <NavigationMenuLink asChild>
            <Link
              href={item.viewAll.href}
              className='text-accent hover:text-accent/80 inline-flex items-center gap-1 text-sm font-medium transition-colors'
            >
              {item.viewAll.label}
              <IconArrowRight className='size-4' />
            </Link>
          </NavigationMenuLink>
        </div>
      )}
    </div>
  );
}

export function DesktopNav() {
  return (
    <NavigationMenu className='max-w-none flex-none justify-start'>
      <NavigationMenuList className='gap-6 space-x-0'>
        {navMenuItems.map((item) =>
          item.type === 'link' ? (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    triggerClassName,
                    'inline-flex items-center gap-2',
                    item.badge && 'text-foreground'
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant='destructive' size='sm'>
                      {item.badge}
                    </Badge>
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
