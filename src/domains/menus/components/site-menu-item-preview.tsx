'use client';

import { IconLink } from '@tabler/icons-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

interface SiteMenuItemPreviewProps {
  item: DtoNavItemResponse;
}

/** Expandable preview of mega-menu columns/links nested under a top-level nav item. */
export function SiteMenuItemPreview({ item }: SiteMenuItemPreviewProps) {
  const isMega = item.type === 'mega';
  const columnCount = item.columns?.length ?? 0;
  const linkCount =
    item.columns?.reduce((total, column) => total + (column.links?.length ?? 0), 0) ?? 0;
  const featuredCount = item.featured?.length ?? 0;

  if (!isMega) {
    return item.href ? (
      <p className='text-muted-foreground mt-2 flex items-center gap-1 text-xs'>
        <IconLink className='h-3.5 w-3.5 shrink-0' />
        {item.href}
      </p>
    ) : null;
  }

  if (columnCount === 0 && featuredCount === 0) {
    return (
      <p className='text-muted-foreground mt-2 text-[11px]'>
        Mega menu — add columns and links in the editor.
      </p>
    );
  }

  return (
    <div className='mt-3 space-y-2' onClick={(event) => event.stopPropagation()}>
      <p className='text-muted-foreground text-[11px]'>
        {columnCount} column{columnCount === 1 ? '' : 's'} · {linkCount} link
        {linkCount === 1 ? '' : 's'}
        {featuredCount > 0 ? ` · ${featuredCount} featured` : ''}
      </p>

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='preview' className='border-border/60 rounded-xl border px-3'>
          <AccordionTrigger className='py-2 text-xs font-semibold hover:no-underline'>
            View mega-menu contents
          </AccordionTrigger>
          <AccordionContent className='pb-3'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {item.columns?.map((column) => (
                <div key={column.title} className='space-y-1.5'>
                  <p className='text-foreground text-[11px] font-bold tracking-wide uppercase'>
                    {column.title}
                  </p>
                  <ul className='space-y-1'>
                    {column.links?.map((link) => (
                      <li
                        key={`${column.title}-${link.title}-${link.href}`}
                        className='text-muted-foreground text-xs'
                      >
                        {link.title}
                        <span className='text-muted-foreground/70 block truncate'>{link.href}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {featuredCount > 0 ? (
              <div className='mt-4 space-y-2'>
                <p className='text-foreground text-[11px] font-bold tracking-wide uppercase'>
                  Featured
                </p>
                <div className='flex flex-wrap gap-2'>
                  {item.featured?.map((card) => (
                    <Badge key={card.title} variant='secondary' className='text-[10px]'>
                      {card.title}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {item.viewAll ? (
              <p className='text-muted-foreground mt-3 text-xs'>
                View all: {item.viewAll.label} → {item.viewAll.href}
              </p>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
