import {
  IconCalendar,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconThumbUp
} from '@tabler/icons-react';

import { AppImage } from '@/components/ui/app-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { CategoryPill } from '@/domains/weblog/components/category-pill';
import {
  formatPublishedDate,
  formatViews,
  readingTimeLabel
} from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBlogPostResponse } from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogPostHeaderProps {
  post: DtoBlogPostResponse;
}

function initials(name: string | undefined): string {
  if (!name) return 'L';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Article title stack: category, headline, excerpt, author, stats, hero. */
export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const date = formatPublishedDate(post.published_at);
  const authorName = post.author?.name ?? 'Luxe Editorial';

  return (
    <header className='mb-8'>
      <CategoryPill
        category={post.category}
        sectionType={post.section_type}
        className='bg-accent/15 text-accent border-accent/20 mb-4 border px-3 py-1'
      />

      <Typography.H1 className='font-display mb-4 text-3xl leading-[1.15] tracking-tight md:text-4xl lg:text-5xl'>
        {post.title}
      </Typography.H1>

      {post.excerpt ? (
        <Typography.Lead className='text-muted-foreground mb-6 max-w-3xl text-base leading-relaxed md:text-lg'>
          {post.excerpt}
        </Typography.Lead>
      ) : null}

      <Flex align='center' gap={3} className='mb-4 flex-wrap'>
        <Avatar className='size-11'>
          {post.author?.avatar_url ? (
            <AvatarImage src={post.author.avatar_url} alt={authorName} />
          ) : null}
          <AvatarFallback>{initials(authorName)}</AvatarFallback>
        </Avatar>
        <Flex direction='column' gap={0.5} className='min-w-0'>
          <Flex align='center' gap={1.5}>
            <Typography.S className='truncate text-sm font-semibold'>{authorName}</Typography.S>
            <IconCircleCheckFilled className='text-accent size-4 shrink-0' aria-label='Verified' />
          </Flex>
          {post.author?.role ? (
            <Typography.Muted className='truncate text-xs'>{post.author.role}</Typography.Muted>
          ) : null}
        </Flex>
      </Flex>

      <Flex align='center' gap={3} className='text-muted-foreground mb-7 flex-wrap text-sm'>
        {date ? (
          <span className='inline-flex items-center gap-1.5'>
            <IconCalendar className='size-4 shrink-0' aria-hidden />
            {date}
          </span>
        ) : null}
        <span className='inline-flex items-center gap-1.5'>
          <IconClock className='size-4 shrink-0' aria-hidden />
          {readingTimeLabel(post.reading_time_minutes)}
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <IconEye className='size-4 shrink-0' aria-hidden />
          {formatViews(post.view_count)}
        </span>
        {post.helpful_votes ? (
          <span className='inline-flex items-center gap-1.5'>
            <IconThumbUp className='size-4 shrink-0' aria-hidden />
            {post.helpful_votes.toLocaleString()}
          </span>
        ) : null}
      </Flex>

      {post.hero_image_url ? (
        <div className='bg-muted relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-[2/1]'>
          <AppImage
            src={post.hero_image_url || IMAGE_FALLBACK}
            alt={post.hero_image_alt || post.title || ''}
            fill
            priority
            sizes='(min-width: 1024px) 70vw, 100vw'
            className='object-cover'
          />
        </div>
      ) : null}
    </header>
  );
}
