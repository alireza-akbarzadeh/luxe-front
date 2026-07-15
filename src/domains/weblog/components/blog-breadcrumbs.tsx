import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { blogCategoryPath } from '@/domains/weblog/lib/blog-format';
import type { DtoBlogCategoryBrief } from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogBreadcrumbsProps {
  category?: DtoBlogCategoryBrief;
  title?: string;
}

/** Home > Category > Article breadcrumbs for article pages. */
export async function BlogBreadcrumbs({ category, title }: BlogBreadcrumbsProps) {
  const t = await getTranslations('weblog.post');

  return (
    <nav aria-label={t('breadcrumbLabel')} className='text-muted-foreground text-sm'>
      <Flex align='center' gap={2} className='flex-wrap'>
        <Link href='/' className='hover:text-foreground transition-colors'>
          {t('breadcrumbHome')}
        </Link>
        <span aria-hidden>/</span>
        <Link href='/weblog' className='hover:text-foreground transition-colors'>
          {t('breadcrumbBlog')}
        </Link>
        {category?.slug ? (
          <>
            <span aria-hidden>/</span>
            <Link
              href={blogCategoryPath(category.slug)}
              className='hover:text-foreground transition-colors'
            >
              {category.name}
            </Link>
          </>
        ) : null}
        {title ? (
          <>
            <span aria-hidden>/</span>
            <Typography.S className='text-foreground line-clamp-1 max-w-[40vw] font-medium'>
              {title}
            </Typography.S>
          </>
        ) : null}
      </Flex>
    </nav>
  );
}
