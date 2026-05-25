'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface DynamicBreadcrumbProps {
  segments?: string[];
  items?: BreadcrumbItemType[];
  homeLabel?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBack?: () => void;
  direction?: 'row' | 'column';
  separator?: React.ReactNode;
  className?: string;
  breadcrumbClassName?: string;
}

export function DynamicBreadcrumb({
  segments,
  items: propItems,
  homeLabel = 'Home',
  showBackButton = true,
  backButtonLabel = 'Back',
  onBack,
  direction = 'row',
  separator,
  className = '',
  breadcrumbClassName = ''
}: DynamicBreadcrumbProps) {
  const router = useRouter();

  let breadcrumbItems: BreadcrumbItemType[] = [];

  if (propItems) {
    breadcrumbItems = [{ label: homeLabel, href: '/' }, ...propItems];
  } else if (segments && segments.length > 0) {
    let currentPath = '';
    const segmentItems = segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      currentPath += `/${segment.toLowerCase().replace(/\s+/g, '-')}`;
      return {
        label: segment,
        href: isLast ? undefined : currentPath
      };
    });
    breadcrumbItems = [{ label: homeLabel, href: '/' }, ...segmentItems];
  } else {
    breadcrumbItems = [{ label: homeLabel, href: '/' }];
  }

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const layoutClasses =
    direction === 'column'
      ? 'flex flex-col items-start gap-6'
      : 'flex flex-wrap items-center justify-between gap-4';

  return (
    <div className={`${layoutClasses} ${className}`}>
      {showBackButton && (
        <button
          onClick={handleBack}
          className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 transition-colors'
          aria-label='Go back'
        >
          <IconArrowLeft className='h-4 w-4' />
          <span className='hidden sm:inline'>{backButtonLabel}</span>
        </button>
      )}

      <Breadcrumb className={breadcrumbClassName}>
        <BreadcrumbList>
          {breadcrumbItems.map((item, idx) => {
            const isLast = idx === breadcrumbItems.length - 1;
            return (
              <BreadcrumbItem key={idx}>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {!isLast &&
                  (separator ? <span className='mx-1'>{separator}</span> : <BreadcrumbSeparator />)}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
