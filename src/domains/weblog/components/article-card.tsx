import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ArticleMeta } from '@/domains/weblog/components/article-meta';
import { CategoryPill } from '@/domains/weblog/components/category-pill';
import { blogPostPath, readingTimeLabel } from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

type ArticleCardVariant = 'feature' | 'standard' | 'compact' | 'list';

interface ArticleCardProps {
  post: DtoBlogPostListItem;
  variant?: ArticleCardVariant;
  /** Preload the image for above-the-fold cards (LCP). */
  priority?: boolean;
  className?: string;
}

/**
 * Magazine article card. `feature` is the large hero-style card, `standard` the
 * default grid card, `compact` a dense image-top card, and `list` a horizontal
 * thumbnail row used in sidebars.
 */
export function ArticleCard({
  post,
  variant = 'standard',
  priority = false,
  className
}: ArticleCardProps) {
  const href = blogPostPath(post.slug);
  const image = post.hero_image_url || IMAGE_FALLBACK;
  const alt = post.hero_image_alt || post.title || 'Article';

  if (variant === 'list') {
    return (
      <Link
        href={href}
        className={cn(
          'group hover:bg-muted/50 flex gap-3 rounded-xl p-2 transition-colors',
          className
        )}
      >
        <div className='bg-muted relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg'>
          <AppImage src={image} alt={alt} fill sizes='80px' className='object-cover' />
        </div>
        <Flex direction='column' gap={1} justify='center' className='min-w-0'>
          <CategoryPill category={post.category} sectionType={post.section_type} />
          <Typography.S className='line-clamp-2 text-sm leading-snug font-semibold group-hover:underline'>
            {post.title}
          </Typography.S>
          <Typography.Muted className='text-xs'>
            {readingTimeLabel(post.reading_time_minutes)}
          </Typography.Muted>
        </Flex>
      </Link>
    );
  }

  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';

  return (
    <Link
      href={href}
      className={cn(
        'group bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md',
        isFeature && 'md:flex-row',
        className
      )}
    >
      <div
        className={cn(
          'bg-muted relative overflow-hidden',
          isFeature ? 'aspect-16/10 md:aspect-auto md:w-3/5' : 'aspect-16/10'
        )}
      >
        <AppImage
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={isFeature ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
          className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
        />
      </div>

      <Flex
        direction='column'
        gap={isFeature ? 3 : 2}
        className={cn('p-4', isFeature ? 'md:w-2/5 md:justify-center md:p-8' : '')}
      >
        <CategoryPill category={post.category} sectionType={post.section_type} />

        <Typography.H3
          className={cn(
            'font-display leading-tight group-hover:underline',
            isFeature
              ? 'text-2xl md:text-3xl'
              : isCompact
                ? 'line-clamp-2 text-base'
                : 'line-clamp-2 text-lg'
          )}
        >
          {post.title}
        </Typography.H3>

        {!isCompact && post.excerpt ? (
          <Typography.Muted className={cn('line-clamp-2 text-sm', isFeature && 'md:line-clamp-3')}>
            {post.excerpt}
          </Typography.Muted>
        ) : null}

        <ArticleMeta
          author={post.author}
          publishedAt={post.published_at}
          readingTimeMinutes={post.reading_time_minutes}
          size={isFeature ? 'md' : 'sm'}
          className='mt-1'
        />
      </Flex>
    </Link>
  );
}
