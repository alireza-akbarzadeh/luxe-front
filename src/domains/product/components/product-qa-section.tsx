'use client';

import { IconBuildingStore, IconCheck, IconLoader2, IconRobot } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { isUnauthorizedError } from '@/lib/api/api-utils';
import {
  getGetProductsIdQuestionsQueryKey,
  useGetProductsIdQuestions
} from '@/services/-products-{id}-questions-get';
import type { DtoProductQuestionResponse } from '@/services/-products-{id}-questions-get.schemas';
import { usePostProductsIdQuestions } from '@/services/-products-{id}-questions-post';

function QuestionThread({ question }: { question: DtoProductQuestionResponse }) {
  const t = useTranslations('pdp.qa');
  const formatter = useFormatter();

  return (
    <article className='border-border/60 rounded-2xl border p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='font-medium'>{question.author || t('shopper')}</p>
            {question.is_verified_buyer && (
              <Badge variant='outline' className='gap-1 text-[10px]'>
                <IconCheck className='h-2.5 w-2.5' /> {t('verifiedBuyer')}
              </Badge>
            )}
            {question.is_owner && (
              <span className='text-accent text-[11px] font-medium'>{t('yourQuestion')}</span>
            )}
          </div>
        </div>
        {question.created_at && (
          <time className='text-muted-foreground shrink-0 text-xs'>
            {formatter.relativeTime(new Date(question.created_at))}
          </time>
        )}
      </div>
      <p className='mt-3 text-sm leading-relaxed'>{question.body}</p>

      {question.answers && question.answers.length > 0 && (
        <ul className='border-border/60 mt-4 space-y-3 border-t pt-4'>
          {question.answers.map((answer) => (
            <li key={answer.id} className='bg-muted/30 rounded-xl p-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-sm font-medium'>{answer.author}</p>
                {answer.is_store_reply && (
                  <Badge variant='secondary' className='gap-1 text-[10px]'>
                    <IconBuildingStore className='h-3 w-3' /> {t('store')}
                  </Badge>
                )}
                {answer.is_ai_reply && (
                  <Badge variant='outline' className='gap-1 text-[10px]'>
                    <IconRobot className='h-3 w-3' /> {t('aiAssistant')}
                  </Badge>
                )}
                {answer.is_verified_buyer && (
                  <Badge variant='outline' className='gap-1 text-[10px]'>
                    <IconCheck className='h-2.5 w-2.5' /> {t('verifiedBuyer')}
                  </Badge>
                )}
              </div>
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{answer.body}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

interface ProductQaSectionProps {
  productId: number;
  productSlug: string;
}

export function ProductQaSection({ productId, productSlug }: ProductQaSectionProps) {
  const t = useTranslations('pdp.qa');
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();
  const productIdStr = String(productId);

  const { data, isLoading } = useGetProductsIdQuestions(productIdStr, {
    limit: 20,
    offset: 0
  });

  const createQuestion = usePostProductsIdQuestions({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProductsIdQuestionsQueryKey(productIdStr, { limit: 20, offset: 0 })
        });
      }
    }
  });

  const questions = data?.data?.questions ?? [];

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (trimmed.length < 5) {
      toast.error(t('toastTooShort'));
      return;
    }
    try {
      await createQuestion.mutateAsync({ id: productIdStr, data: { body: trimmed } });
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
        <h3 className='font-display text-lg font-semibold'>{t('askTitle')}</h3>
        <p className='text-muted-foreground mt-1 text-sm'>{t('askDescription')}</p>

        {isAuthenticated ? (
          <div className='mt-4 space-y-3'>
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t('placeholder')}
              rows={3}
              disabled={createQuestion.isPending}
            />
            <Button
              className='rounded-full px-6'
              disabled={createQuestion.isPending}
              onClick={() => void handleSubmit()}
            >
              {t('postQuestion')}
            </Button>
          </div>
        ) : (
          <Button asChild className='mt-4 rounded-full'>
            <Link href={`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}>
              {t('signInToAsk')}
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <IconLoader2 className='text-accent h-6 w-6 animate-spin' />
        </div>
      ) : questions.length > 0 ? (
        <div className='space-y-4'>
          {questions.map((question) => (
            <QuestionThread key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <p className='text-muted-foreground py-8 text-center text-sm'>{t('empty')}</p>
      )}
    </div>
  );
}
