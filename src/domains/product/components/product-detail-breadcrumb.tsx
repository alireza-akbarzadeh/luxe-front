import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface ProductBreadcrumbItem {
  label: string;
  href?: string;
}

interface ProductDetailBreadcrumbProps {
  items: ProductBreadcrumbItem[];
  className?: string;
}

/** Server-rendered PDP breadcrumb — no client router hook. */
export async function ProductDetailBreadcrumb({ items, className }: ProductDetailBreadcrumbProps) {
  const t = await getTranslations('pdp');
  const homeLabel = t('breadcrumb.home');

  return (
    <Breadcrumb className={cn('text-muted-foreground text-xs', className)}>
      <BreadcrumbList className='flex items-center gap-1.5'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>{homeLabel}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbSeparator>
                <IconChevronRight className={cn('h-3 w-3', 'cn-rtl-flip')} />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
