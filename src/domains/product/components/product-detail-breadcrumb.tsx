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
}

/** Server-rendered PDP breadcrumb — no client router hook. */
export async function ProductDetailBreadcrumb({ items }: ProductDetailBreadcrumbProps) {
  const t = await getTranslations('pdp');
  const homeLabel = t('breadcrumb.home');

  return (
    <Breadcrumb className='text-muted-foreground text-xs'>
      <BreadcrumbList className='flex flex-col items-start gap-1.5 sm:flex-row sm:items-center'>
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
