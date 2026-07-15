'use client';

import { IconShare3, IconThumbUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { copyToClipboard } from '@/lib/utils';
import { usePostBlogPostsSlugHelpful } from '@/services/-blog-posts-{slug}-helpful-post';

interface BlogEngagementBarProps {
  slug: string;
  title: string;
  url: string;
  helpfulVotes?: number;
  commentsHref?: string;
  commentsCount?: number;
  /** Sticky mobile bottom bar vs inline desktop actions. */
  variant?: 'inline' | 'sticky';
}

/** Helpful / share engagement actions for article pages. */
export function BlogEngagementBar({
  slug,
  title,
  url,
  helpfulVotes = 0,
  commentsHref = '#comments',
  commentsCount,
  variant = 'inline'
}: BlogEngagementBarProps) {
  const t = useTranslations('weblog.post');
  const helpful = usePostBlogPostsSlugHelpful();
  const [votes, setVotes] = useState(helpfulVotes);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (voted || helpful.isPending) return;
    helpful.mutate(
      { slug },
      {
        onSuccess: () => {
          setVoted(true);
          setVotes((prev) => prev + 1);
          toast.success(t('helpfulThanks'));
        },
        onError: () => toast.error(t('helpfulError'))
      }
    );
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall through to clipboard copy when share is cancelled/unavailable.
      }
    }
    await copyToClipboard(url, t('linkCopiedLabel'));
  };

  if (variant === 'sticky') {
    return (
      <div className='bg-background/95 border-border fixed inset-x-0 bottom-0 z-40 border-t p-3 backdrop-blur lg:hidden'>
        <Flex direction='row' align='center' gap={2}>
          <Button
            type='button'
            variant={voted ? 'secondary' : 'outline'}
            size='sm'
            className='flex-1 gap-1.5'
            onClick={handleHelpful}
            disabled={voted || helpful.isPending}
          >
            <IconThumbUp className='size-4' />
            {t('helpful')}
            {votes > 0 ? ` · ${votes.toLocaleString()}` : ''}
          </Button>
          <Button asChild variant='outline' size='sm' className='flex-1'>
            <a href={commentsHref}>
              {t('comments')}
              {commentsCount != null ? ` · ${commentsCount}` : ''}
            </a>
          </Button>
          <Button
            type='button'
            size='sm'
            className='flex-1 gap-1.5'
            onClick={() => void handleShare()}
          >
            <IconShare3 className='size-4' />
            {t('shareArticle')}
          </Button>
        </Flex>
      </div>
    );
  }

  return (
    <Flex direction='row' align='center' wrap='wrap' gap={2}>
      <Button
        type='button'
        variant={voted ? 'secondary' : 'outline'}
        size='sm'
        className='gap-1.5'
        onClick={handleHelpful}
        disabled={voted || helpful.isPending}
      >
        <IconThumbUp className='size-4' />
        {t('helpful')}
        {votes > 0 ? ` · ${votes.toLocaleString()}` : ''}
      </Button>
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='gap-1.5'
        onClick={() => void handleShare()}
      >
        <IconShare3 className='size-4' />
        {t('shareArticle')}
      </Button>
    </Flex>
  );
}
