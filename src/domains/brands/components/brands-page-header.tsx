'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface BrandsBreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

/** Shared breadcrumb for brands directory and brand detail. */
export function BrandsBreadcrumb({ items, className }: BrandsBreadcrumbProps) {
  return (
    <Flex
      direction='row'
      align='center'
      className={cn('text-muted-foreground py-4 text-xs', className)}
    >
      <DynamicBreadcrumb
        items={items}
        showBackButton={false}
        direction='row'
        separator={<IconChevronRight className='h-3 w-3' aria-hidden />}
        className='min-w-0'
        breadcrumbClassName='flex flex-wrap items-center gap-1.5'
      />
    </Flex>
  );
}

interface BrandsPageHeaderProps {
  title: string;
  subtitle: string;
}

/** Directory page title block. */
export function BrandsPageHeader({ title, subtitle }: BrandsPageHeaderProps) {
  return (
    <Flex direction='column' gap={2} className='max-w-2xl pb-2'>
      <Typography.H1 family='display' className='text-4xl font-semibold tracking-tight sm:text-5xl'>
        {title}
      </Typography.H1>
      <Typography.Muted className='text-base sm:text-lg'>{subtitle}</Typography.Muted>
    </Flex>
  );
}
