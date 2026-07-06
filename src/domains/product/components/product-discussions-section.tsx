'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { isUnauthorizedError } from '@/lib/api/api-utils';
import { usePostProductsIdDiscussionsDiscussionIdReplies } from '@/services/-products-{id}-discussions-{discussionId}-replies-post';
import {
  getGetProductsIdDiscussionsQueryKey,
  useGetProductsIdDiscussions
} from '@/services/-products-{id}-discussions-get';
import type { DtoProductDiscussionResponse } from '@/services/-products-{id}-discussions-get.schemas';
import { usePostProductsIdDiscussions } from '@/services/-products-{id}-discussions-post';

const LIST_PARAMS = { limit: 20, offset: 0 } as const;

function DiscussionThread({
  discussion,
  productIdStr,
  onReplyPosted
}: {
  discussion: DtoProductDiscussionResponse;
  productIdStr: string;
  onReplyPosted: () => void;
}) {
  const t = useTranslations('pdp.discussions');
  const formatter = useFormatter();
  const { isAuthenticated } = useAuth();
  const [replyBody, setReplyBody] = useState('');

  const createReply = usePostProductsIdDiscussionsDiscussionIdReplies({
    mutation: { onSuccess: onReplyPosted }
  });

  const handleReply = async () => {
    const trimmed = replyBody.trim();
    if (trimmed.length < 2) {
      toast.error(t('toastReplyTooShort'));
      return;
    }
    if (!discussion.id) return;
    try {
      await createReply.mutateAsync({
        id: productIdStr,
        discussionId: discussion.id,
        data: { body: trimmed }
      });
      setReplyBody('');
      toast.success(t('toastReplyPosted'));
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast.error(t('toastSignIn'));
        return;
      }
      toast.error(t('toastFailed'));
    }
  };

  return (
    <article className='border-border/60 rounded-2xl border p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-medium'>{discussion.author || t('shopper')}</p>
          {discussion.is_owner && (
            <span className='text-accent text-[11px] font-medium'>{t('yourThread')}</span>
          )}
        </div>
        {discussion.created_at && (
          <time className='text-muted-foreground shrink-0 text-xs'>
            {formatter.relativeTime(new Date(discussion.created_at))}
          </time>
        )}
      </div>
      <h4 className='mt-3 font-semibold'>{discussion.title}</h4>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{discussion.body}</p>

      {discussion.replies && discussion.replies.length > 0 && (
        <ul className='border-border/60 mt-4 space-y-3 border-t pt-4'>
          {discussion.replies.map((reply) => (
            <li key={reply.id} className='bg-muted/30 rounded-xl p-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-sm font-medium'>{reply.author || t('shopper')}</p>
              </div>
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{reply.body}</p>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? (
        <div className='mt-4 space-y-2'>
          <Textarea
            value={replyBody}
            onChange={(event) => setReplyBody(event.target.value)}
            placeholder={t('replyPlaceholder')}
            rows={2}
            disabled={createReply.isPending}
          />
          <Button
            variant='outline'
            size='sm'
            className='rounded-full px-4'
            disabled={createReply.isPending}
            onClick={() => void handleReply()}
          >
            {t('postReply')}
          </Button>
        </div>
      ) : null}
    </article>
  );
}

interface ProductDiscussionsSectionProps {
  productId: number;
  productSlug: string;
}

/** Community discussion threads on the PDP — distinct from seller Q&A. */
export function ProductDiscussionsSection({ productId, productSlug }: ProductDiscussionsSectionProps) {
  const t = useTranslations('pdp.discussions');
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();
  const productIdStr = String(productId);

  const { data, isLoading } = useGetProductsIdDiscussions(productIdStr, LIST_PARAMS);

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: getGetProductsIdDiscussionsQueryKey(productIdStr, LIST_PARAMS)
    });
  };

  const createDiscussion = usePostProductsIdDiscussions({
    mutation: { onSuccess: invalidate }
  });

  const discussions = data?.data?.discussions ?? [];

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (trimmedTitle.length < 5) {
      toast.error(t('toastTitleTooShort'));
      return;
    }
    if (trimmedBody.length < 10) {
      toast.error(t('toastBodyTooShort'));
      return;
    }
    try {
      await createDiscussion.mutateAsync({
        id: productIdStr,
        data: { title: trimmedTitle, body: trimmedBody }
      });
      setTitle('');
      setBody('');
      toast.success(t('toastPosted'));
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast.error(t('toastSignIn'));
        return;
      }
      toast.error(t('toastFailed'));
    }
  };

  return (
    <div className='space-y-8'>
      <div className='border-border/60 bg-card rounded-2xl border p-6'>
        <h3 className='font-display text-lg font-semibold'>{t('startTitle')}</h3>
        <p className='text-muted-foreground mt-1 text-sm'>{t('startDescription')}</p>

        {isAuthenticated ? (
          <div className='mt-4 space-y-3'>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('titlePlaceholder')}
              disabled={createDiscussion.isPending}
            />
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t('bodyPlaceholder')}
              rows={4}
              disabled={createDiscussion.isPending}
            />
            <Button
              className='rounded-full px-6'
              disabled={createDiscussion.isPending}
              onClick={() => void handleSubmit()}
            >
              {t('postDiscussion')}
            </Button>
          </div>
        ) : (
          <Button asChild className='mt-4 rounded-full'>
            <Link href={`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}>
              {t('signInToPost')}
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <IconLoader2 className='text-accent h-6 w-6 animate-spin' />
        </div>
      ) : discussions.length > 0 ? (
        <div className='space-y-4'>
          {discussions.map((discussion) => (
            <DiscussionThread
              key={discussion.id}
              discussion={discussion}
              productIdStr={productIdStr}
              onReplyPosted={invalidate}
            />
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground py-8 text-center text-sm'>{t('empty')}</p>
      )}
    </div>
  );
}
