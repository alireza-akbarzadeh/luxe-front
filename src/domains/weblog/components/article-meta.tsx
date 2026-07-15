import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { formatPublishedDate, readingTimeLabel } from '@/domains/weblog/lib/blog-format';
import { cn } from '@/lib/utils';
import type { DtoBlogAuthorBrief } from '@/services/-blog-homepage-get.schemas';

interface ArticleMetaProps {
  author?: DtoBlogAuthorBrief;
  publishedAt?: string;
  readingTimeMinutes?: number;
  /** Compact hides the author role and shrinks the avatar. */
  size?: 'sm' | 'md';
  className?: string;
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

/** Author + publication date + reading time byline used on cards and article headers. */
export function ArticleMeta({
  author,
  publishedAt,
  readingTimeMinutes,
  size = 'md',
  className
}: ArticleMetaProps) {
  const date = formatPublishedDate(publishedAt);
  const compact = size === 'sm';

  return (
    <Flex align='center' gap={compact ? 2 : 3} className={cn('min-w-0', className)}>
      <Avatar size={compact ? 'sm' : 'default'}>
        {author?.avatar_url ? (
          <AvatarImage src={author.avatar_url} alt={author.name ?? ''} />
        ) : null}
        <AvatarFallback>{initials(author?.name)}</AvatarFallback>
      </Avatar>

      <Flex direction='column' className='min-w-0'>
        <Typography.S className='truncate text-sm font-medium'>
          {author?.name ?? 'Luxe Editorial'}
        </Typography.S>
        <Flex align='center' gap={1.5} className='text-muted-foreground text-xs'>
          {!compact && author?.role ? (
            <>
              <span className='truncate'>{author.role}</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          {date ? <span>{date}</span> : null}
          {date ? <span aria-hidden>·</span> : null}
          <span>{readingTimeLabel(readingTimeMinutes)}</span>
        </Flex>
      </Flex>
    </Flex>
  );
}
