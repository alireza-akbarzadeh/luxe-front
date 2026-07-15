import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { blogCategoryPath, sectionLabel } from '@/domains/weblog/lib/blog-format';
import { cn } from '@/lib/utils';
import type { DtoBlogCategoryBrief } from '@/services/-blog-homepage-get.schemas';

interface CategoryPillProps {
  category?: DtoBlogCategoryBrief;
  sectionType?: string;
  className?: string;
}

/**
 * Small overline badge shown on cards and article headers. Prefers the category
 * (links to its landing page); falls back to the section-type label.
 */
export function CategoryPill({ category, sectionType, className }: CategoryPillProps) {
  const label = category?.name ?? sectionLabel(sectionType);
  const classes = cn('uppercase tracking-wide', className);

  if (category?.slug) {
    return (
      <Badge asChild variant='secondary' size='sm' className={classes}>
        <Link href={blogCategoryPath(category.slug)}>{label}</Link>
      </Badge>
    );
  }

  return (
    <Badge variant='secondary' size='sm' className={classes}>
      {label}
    </Badge>
  );
}
