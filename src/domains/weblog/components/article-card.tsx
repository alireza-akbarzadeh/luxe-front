import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ArticleMeta } from '@/domains/weblog/components/article-meta';
import { CategoryPill } from '@/domains/weblog/components/category-pill';
import {
  blogPostPath,
  formatPublishedDate,
  formatViews,
  readingTimeLabel
} from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

type ArticleCardVariant = 'feature' | 'standard' | 'compact' | 'list' | 'trending';

interface ArticleCardProps {
  post: DtoBlogPostListItem;
  variant?: ArticleCardVariant;
  /** Preload the image for above-the-fold cards (LCP). */
  priority?: boolean;
  className?: string;
}

/**
 * Magazine article card. `feature` is the large hero overlay card, `standard` the
 * default grid card, `compact` a dense image-top card, `list` a horizontal
 * thumbnail row, and `trending` a carousel tile.
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
        <div className='bg-muted relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg sm:w-36'>
          <AppImage src={image} alt={alt} fill sizes='144px' className='object-cover' />
        </div>
        <Flex direction='column' gap={1.5} justify='center' className='min-w-0 flex-1 py-0.5'>
          <CategoryPill category={post.category} sectionType={post.section_type} linkable={false} />
          <Typography.S className='line-clamp-2 text-sm leading-snug font-semibold group-hover:underline sm:text-base'>
            {post.title}
          </Typography.S>
          {post.excerpt ? (
            <Typography.Muted className='line-clamp-2 hidden text-xs sm:block'>
              {post.excerpt}
            </Typography.Muted>
          ) : null}
          <Typography.Muted className='text-xs'>
            {[
              formatPublishedDate(post.published_at),
              readingTimeLabel(post.reading_time_minutes),
              formatViews(post.view_count)
            ]
              .filter(Boolean)
              .join(' · ')}
          </Typography.Muted>
        </Flex>
      </Link>
    );
  }

  if (variant === 'trending') {
    return (
      <Link
        href={href}
        className={cn('group flex w-44 shrink-0 flex-col gap-2 sm:w-52', className)}
      >
        <div className='bg-muted relative aspect-square overflow-hidden rounded-2xl'>
          <AppImage
            src={image}
            alt={alt}
            fill
            sizes='208px'
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
          />
          <div className='absolute start-2 top-2'>
            <CategoryPill
              category={post.category}
              sectionType={post.section_type}
              linkable={false}
            />
          </div>
        </div>
        <Typography.S className='line-clamp-2 text-sm leading-snug font-semibold group-hover:underline'>
          {post.title}
        </Typography.S>
        <Typography.Muted className='text-xs'>
          {formatPublishedDate(post.published_at)}
        </Typography.Muted>
      </Link>
    );
  }

  if (variant === 'feature') {
    return (
      <Link
        href={href}
        className={cn(
          'group relative block min-h-[22rem] overflow-hidden rounded-2xl sm:min-h-[26rem] lg:min-h-[28rem]',
          className
        )}
      >
        <AppImage
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes='(min-width: 1024px) 66vw, 100vw'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10' />
        <div className='absolute start-4 top-4 z-10'>
          <span className='bg-accent text-accent-foreground rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider uppercase'>
            Featured
          </span>
        </div>
        <Flex direction='column' gap={3} className='absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7'>
          <CategoryPill category={post.category} sectionType={post.section_type} linkable={false} />
          <Typography.H2 className='font-display text-2xl leading-tight text-white sm:text-3xl lg:text-4xl'>
            {post.title}
          </Typography.H2>
          {post.excerpt ? (
            <Typography.Muted className='line-clamp-2 max-w-2xl text-sm text-white/80'>
              {post.excerpt}
            </Typography.Muted>
          ) : null}
          <Flex align='center' justify='between' gap={3} className='flex-wrap pt-1'>
            <ArticleMeta
              author={post.author}
              publishedAt={post.published_at}
              readingTimeMinutes={post.reading_time_minutes}
              size='sm'
              className='[&_p]:text-white [&_span]:text-white/70'
            />
            <Typography.Muted className='text-xs text-white/70'>
              {formatViews(post.view_count)}
              {post.helpful_votes ? ` · ${post.helpful_votes.toLocaleString()} likes` : null}
            </Typography.Muted>
          </Flex>
        </Flex>
      </Link>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <Link
      href={href}
      className={cn(
        'group bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className='bg-muted relative aspect-16/10 overflow-hidden'>
        <AppImage
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes='(min-width: 1024px) 33vw, 100vw'
          className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
        />
      </div>

      <Flex direction='column' gap={2} className='p-4'>
        <CategoryPill category={post.category} sectionType={post.section_type} linkable={false} />

        <Typography.H3
          className={cn(
            'font-display leading-tight group-hover:underline',
            isCompact ? 'line-clamp-2 text-base' : 'line-clamp-2 text-lg'
          )}
        >
          {post.title}
        </Typography.H3>

        {!isCompact && post.excerpt ? (
          <Typography.Muted className='line-clamp-2 text-sm'>{post.excerpt}</Typography.Muted>
        ) : null}

        <ArticleMeta
          author={post.author}
          publishedAt={post.published_at}
          readingTimeMinutes={post.reading_time_minutes}
          size='sm'
          className='mt-1'
        />
      </Flex>
    </Link>
  );
}
