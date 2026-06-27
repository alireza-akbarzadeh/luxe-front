'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconMessageCircle,
  IconStar
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Typography } from '@/components/ui/typography';
import { useGetUsersMeQuestions } from '@/services/-users-me-questions-get';
import { useGetUsersMeReviews } from '@/services/-users-me-reviews-get';

import {
  type PaginatedQuestionsData,
  type PaginatedReviewsData,
  readPaginatedData
} from '../lib/account-list-data';

const PAGE_SIZE = 8;

function formatActivityDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AccountActivity() {
  const [section, setSection] = useState<'reviews' | 'questions'>('reviews');
  const [reviewPage, setReviewPage] = useState(0);
  const [questionPage, setQuestionPage] = useState(0);
  const t = useTranslations('account.activity');
  const tCommon = useTranslations('account.common');

  const reviewOffset = reviewPage * PAGE_SIZE;
  const questionOffset = questionPage * PAGE_SIZE;

  const reviewsQuery = useGetUsersMeReviews({ limit: PAGE_SIZE, offset: reviewOffset });
  const questionsQuery = useGetUsersMeQuestions({ limit: PAGE_SIZE, offset: questionOffset });

  const reviewsData = readPaginatedData<PaginatedReviewsData>(reviewsQuery.data);
  const questionsData = readPaginatedData<PaginatedQuestionsData>(questionsQuery.data);

  const reviews = reviewsData?.reviews ?? [];
  const reviewTotal = reviewsData?.total ?? 0;
  const reviewTotalPages = Math.max(1, Math.ceil(reviewTotal / PAGE_SIZE));

  const questions = questionsData?.questions ?? [];
  const questionTotal = questionsData?.total ?? 0;
  const questionTotalPages = Math.max(1, Math.ceil(questionTotal / PAGE_SIZE));

  const activeQuery = section === 'reviews' ? reviewsQuery : questionsQuery;
  const activePage = section === 'reviews' ? reviewPage : questionPage;
  const activeTotalPages = section === 'reviews' ? reviewTotalPages : questionTotalPages;
  const setActivePage = section === 'reviews' ? setReviewPage : setQuestionPage;

  if (activeQuery.isLoading) {
    return (
      <div className='bg-card border-border space-y-4 rounded-2xl border p-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='bg-muted/60 h-24 animate-pulse rounded-xl' />
        ))}
      </div>
    );
  }

  if (activeQuery.isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center'>
        <Text tone='destructive' className='font-medium'>
          {t('loadError')}
        </Text>
        <Text variant='muted' className='mt-2 text-sm'>
          {tCommon('connectionError')}
        </Text>
        <Button variant='outline' className='mt-5' onClick={() => void activeQuery.refetch()}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <Typography.H3>{t('title')}</Typography.H3>
        <Text variant='muted' className='mt-1 text-sm'>
          {t('subtitle')}
        </Text>
      </div>

      <Tabs
        value={section}
        onValueChange={(value) => setSection(value as 'reviews' | 'questions')}
        className='space-y-6'
      >
        <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
          <TabsTrigger value='reviews' className='gap-2 rounded-full px-5 py-2.5'>
            <IconStar className='h-4 w-4' />
            {t('reviewsTab')}
          </TabsTrigger>
          <TabsTrigger value='questions' className='gap-2 rounded-full px-5 py-2.5'>
            <IconMessageCircle className='h-4 w-4' />
            {t('questionsTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='reviews' className='space-y-4'>
          {reviews.length === 0 ? (
            <EmptyState
              title={t('reviewsEmptyTitle')}
              description={t('reviewsEmptyDescription')}
              actionHref='/shop'
              actionLabel={t('browseProducts')}
            />
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className='bg-card border-border rounded-2xl border p-5 sm:p-6'
              >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    {review.product_slug ? (
                      <Link
                        href={`/products/${review.product_slug}`}
                        className='font-medium hover:underline'
                      >
                        {review.product_name ?? tCommon('product')}
                      </Link>
                    ) : (
                      <Text className='font-medium'>
                        {review.product_name ?? tCommon('product')}
                      </Text>
                    )}
                    <Text variant='muted' className='mt-1 text-sm'>
                      {formatActivityDate(review.created_at) ?? tCommon('noDate')}
                    </Text>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary'>{t('rating', { value: review.rating ?? 0 })}</Badge>
                    {review.status ? <Badge variant='outline'>{review.status}</Badge> : null}
                  </div>
                </div>
                {review.title ? <Text className='mt-3 font-medium'>{review.title}</Text> : null}
                {review.comment ? (
                  <Text variant='muted' className='mt-2 text-sm leading-relaxed'>
                    {review.comment}
                  </Text>
                ) : null}
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value='questions' className='space-y-4'>
          {questions.length === 0 ? (
            <EmptyState
              title={t('questionsEmptyTitle')}
              description={t('questionsEmptyDescription')}
              actionHref='/shop'
              actionLabel={t('browseProducts')}
            />
          ) : (
            questions.map((question) => (
              <article
                key={question.id}
                className='bg-card border-border rounded-2xl border p-5 sm:p-6'
              >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    {question.product_slug ? (
                      <Link
                        href={`/products/${question.product_slug}`}
                        className='font-medium hover:underline'
                      >
                        {question.product_name ?? tCommon('product')}
                      </Link>
                    ) : (
                      <Text className='font-medium'>
                        {question.product_name ?? tCommon('product')}
                      </Text>
                    )}
                    <Text variant='muted' className='mt-1 text-sm'>
                      {formatActivityDate(question.created_at) ?? tCommon('noDate')}
                    </Text>
                  </div>
                  {question.answers && question.answers.length > 0 ? (
                    <Badge variant='secondary'>
                      {t('answersCount', { count: question.answers.length })}
                    </Badge>
                  ) : (
                    <Badge variant='outline'>{t('awaitingAnswer')}</Badge>
                  )}
                </div>
                <Text className='mt-3 leading-relaxed'>{question.body}</Text>
              </article>
            ))
          )}
        </TabsContent>
      </Tabs>

      {(section === 'reviews' ? reviewTotal : questionTotal) > PAGE_SIZE ? (
        <div className='flex items-center justify-between gap-4'>
          <Text variant='muted' className='text-sm'>
            {tCommon('pageOf', { current: activePage + 1, total: activeTotalPages })}
          </Text>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={activePage === 0}
              onClick={() => setActivePage((current) => Math.max(0, current - 1))}
            >
              <IconChevronLeft className='h-4 w-4' />
              {tCommon('previous')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={activePage + 1 >= activeTotalPages}
              onClick={() => setActivePage((current) => current + 1)}
            >
              {tCommon('next')}
              <IconChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-14'>
      <Typography.H4>{title}</Typography.H4>
      <Text variant='muted' className='mx-auto mt-2 max-w-sm text-sm'>
        {description}
      </Text>
      <Button asChild className='mt-6'>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
