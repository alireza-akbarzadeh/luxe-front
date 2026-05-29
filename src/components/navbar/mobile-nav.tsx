'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { navMenuItems, navUtilityLinks } from '@/lib/nav-menu-data';

type MobileNavProps = {
  onNavigate?: () => void;
};

export function MobileNav({ onNavigate }: MobileNavProps) {
  const megaItems = navMenuItems.filter((item) => item.type === 'mega');
  const linkItems = navMenuItems.filter((item) => item.type === 'link');

  return (
    <div className='space-y-2'>
      <Accordion type='multiple' className='w-full'>
        {megaItems.map((item) => (
          <AccordionItem key={item.label} value={item.label} className='border-border/60'>
            <AccordionTrigger className='py-3 text-base font-medium hover:no-underline'>
              {item.label}
            </AccordionTrigger>
            <AccordionContent className='pb-4'>
              <div className='space-y-6 pl-1'>
                {item.columns.map((column) => (
                  <div key={column.title}>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase'>
                      {column.title}
                    </p>
                    <ul className='space-y-1'>
                      {column.links.map((link) => (
                        <li key={link.title}>
                          <Link
                            href={link.href}
                            onClick={onNavigate}
                            className='text-muted-foreground hover:text-foreground block py-2 text-sm transition-colors'
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {item.viewAll && (
                  <Link
                    href={item.viewAll.href}
                    onClick={onNavigate}
                    className='text-accent inline-flex items-center gap-1 text-sm font-medium'
                  >
                    {item.viewAll.label}
                    <IconArrowRight className='size-4' />
                  </Link>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Separator className='my-2' />

      <div className='space-y-1'>
        {linkItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className='hover:text-foreground flex items-center gap-2 py-3 text-base font-medium transition-colors'
          >
            {item.label}
            {item.badge && (
              <Badge variant='destructive' size='sm'>
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </div>

      <Separator className='my-2' />

      <div className='space-y-1'>
        <p className='text-muted-foreground py-2 text-xs font-semibold tracking-wider uppercase'>
          More
        </p>
        {navUtilityLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className='text-muted-foreground hover:text-foreground block py-2 text-sm transition-colors'
          >
            {link.label}
          </Link>
        ))}
        <Link
          href='/shop'
          onClick={onNavigate}
          className='text-accent inline-flex items-center gap-1 py-2 text-sm font-medium'
        >
          Shop all products
          <IconArrowRight className='size-4' />
        </Link>
      </div>
    </div>
  );
}
