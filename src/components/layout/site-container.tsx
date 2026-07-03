import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { siteContainerClass } from '@/lib/layout/site-container';
import { cn } from '@/lib/utils';

type SiteContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/** Horizontal page shell aligned with navbar and footer. */
export function SiteContainer<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: SiteContainerProps<T>) {
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag className={cn(siteContainerClass, className)} {...props}>
      {children}
    </Tag>
  );
}
