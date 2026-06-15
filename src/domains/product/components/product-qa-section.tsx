'use client';

import { IconBuildingStore, IconLoader2, IconRobot } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
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
  return (
    <article className='border-border/60 rounded-2xl border p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-medium'>{question.author || 'Shopper'}</p>
          {question.is_owner && (
            <span className='text-accent text-[11px] font-medium'>Your question</span>
          )}
        </div>
        {question.created_at && (
          <time className='text-muted-foreground shrink-0 text-xs'>
            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
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
                    <IconBuildingStore className='h-3 w-3' /> Store
                  </Badge>
                )}
                {answer.is_ai_reply && (
                  <Badge variant='outline' className='gap-1 text-[10px]'>
                    <IconRobot className='h-3 w-3' /> AI assistant
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
      toast.error('Question must be at least 5 characters');
      return;
    }
    try {
      await createQuestion.mutateAsync({ id: productIdStr, data: { body: trimmed } });
      setBody('');
      toast.success('Question posted — the store assistant will reply shortly');
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast.error('Sign in to ask a question');
        return;
      }
      toast.error('Failed to post question');
    }
  };

  return (
    <div className='space-y-8'>
      <div className='border-border/60 bg-card rounded-2xl border p-6'>
        <h3 className='font-display text-lg font-semibold'>Ask a question</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Get answers from the seller or our AI shopping assistant before you buy.
        </p>

        {isAuthenticated ? (
          <div className='mt-4 space-y-3'>
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder='e.g. Is this watch water resistant? What is the warranty?'
              rows={3}
              disabled={createQuestion.isPending}
            />
            <Button
              className='rounded-full px-6'
              disabled={createQuestion.isPending}
              onClick={() => void handleSubmit()}
            >
              Post question
            </Button>
          </div>
        ) : (
          <Button asChild className='mt-4 rounded-full'>
            <Link href={`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}>
              Sign in to ask
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
        <p className='text-muted-foreground py-8 text-center text-sm'>
          No questions yet. Be the first to ask about this product.
        </p>
      )}
    </div>
  );
}
