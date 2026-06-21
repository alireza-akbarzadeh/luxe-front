import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

export function MegaMenuPanel({ item }: { item: DtoNavItemResponse }) {
  const columnCount = item?.columns?.length;
  const hasFeatured = (item.featured?.length ?? 0) > 0;

  return (
    <div className={cn('w-full', hasFeatured ? 'md:w-205' : 'md:w-160')}>
      <div className='flex gap-6 p-6'>
        <div
          className={cn(
            'grid flex-1 gap-8',
            columnCount === 2 && 'grid-cols-2',
            columnCount === 3 && 'grid-cols-3',
            Number(columnCount) >= 4 && 'grid-cols-2 lg:grid-cols-4'
          )}
        >
          {item?.columns?.map((column) => (
            <div key={column.title} className='space-y-3'>
              <p className='text-foreground text-xs font-semibold tracking-wider uppercase'>
                {column.title}
              </p>
              <ul className='space-y-1'>
                {column?.links?.map((link) => (
                  <li key={link.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href as string}
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
          <aside className='hidden w-45 shrink-0 sm:block'>
            {item.featured.map((card) => (
              <NavigationMenuLink key={card.title} asChild>
                <Link
                  href={card.href as string}
                  className='group bg-muted/40 hover:bg-muted/70 relative block overflow-hidden rounded-xl transition-colors outline-none'
                >
                  <div className='relative aspect-4/5 w-full'>
                    <Image
                      src={card.image as string}
                      alt={card.title as string}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      sizes='180px'
                    />
                    <div className='from-foreground/70 absolute inset-0 bg-linear-to-t to-transparent' />
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
              href={item.viewAll.href as string}
              className='text-accent hover:text-accent/80 group inline-flex items-center gap-1 text-sm font-medium transition-colors'
            >
              {item.viewAll.label}
              <IconArrowRight className='cn-rtl-flip size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
            </Link>
          </NavigationMenuLink>
        </div>
      )}
    </div>
  );
}
