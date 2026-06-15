'use client';

import { IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { StoreRatingInput } from '@/domains/store/components/store-rating-input';
import { StoreReviewFormSkeleton } from '@/domains/store/components/store-skeleton-loading';
import { useStoreReviewMutations } from '@/domains/store/hooks/useStoreReviewMutations';
import {
  defaultStoreReviewValues,
  type StoreReviewFormValues,
  storeReviewSchema} from '@/domains/store/schemas/store-review.schema';
import type {
  StoreReviewMeResponse,
  StoreReviewResponse
} from '@/domains/store/types/store-review.types';
import { isUnauthorizedError } from '@/lib/api/api-utils';
import { useGetStoresSlugReviewsMe } from '@/services/-stores-{slug}-reviews-me-get';
import { useAppForm } from '~/src/components/forms/useAppForm';

interface StoreReviewFormProps {
  slug: string;
}

interface StoreReviewFormFieldsProps {
  slug: string;
  myReview: StoreReviewResponse | null;
}

function StoreReviewFormFields({ slug, myReview }: StoreReviewFormFieldsProps) {
  const isEditing = Boolean(myReview?.id);
  const { createReview, updateReview, deleteReview } = useStoreReviewMutations(slug);

  const initialValues: StoreReviewFormValues = myReview
    ? { rating: myReview.rating ?? 5, comment: myReview.comment ?? '' }
    : defaultStoreReviewValues;

  const form = useAppForm({
    defaultValues: initialValues,
    validators: { onSubmit: storeReviewSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        if (isEditing && myReview?.id) {
          await updateReview.mutateAsync({
            slug,
            reviewId: myReview.id,
            data: { rating: value.rating, comment: value.comment }
          });
          toast.success('Review updated');
        } else {
          await createReview.mutateAsync({
            slug,
            data: { rating: value.rating, comment: value.comment }
          });
          toast.success('Review published');
          formApi.reset();
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          toast.error('Sign in to leave a review');
          return;
        }
        toast.error(isEditing ? 'Failed to update review' : 'Failed to submit review');
      }
    }
  });

  const isPending =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;

  return (
    <div className='border-gold/15 bg-card rounded-2xl border p-6 shadow-sm'>
      <div className='mb-5'>
        <h3 className='font-display text-lg font-semibold'>
          {isEditing ? 'Update your review' : 'Write a review'}
        </h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          {isEditing
            ? 'You can edit or remove your review anytime.'
            : 'Help other shoppers by rating this store.'}
        </p>
      </div>

      <form.AppForm>
        <form.Root
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className='space-y-5'
        >
          <form.Field name='rating'>
            {(field) => (
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Your rating</label>
                <StoreRatingInput
                  value={field.state.value}
                  onChange={(rating) => field.handleChange(rating)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className='text-destructive text-xs'>{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.AppField name='comment'>
            {(field) => (
              <field.TextArea
                label='Your review'
                placeholder='Tell others about product quality, shipping, customer service…'
                rows={4}
                disabled={isPending}
              />
            )}
          </form.AppField>

          <div className='flex flex-wrap items-center gap-2'>
            <form.Submit
              label={isEditing ? 'Update review' : 'Post review'}
              isPending={isPending}
              className='rounded-full px-6'
            />

            {isEditing && myReview?.id && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='rounded-full'
                disabled={isPending}
                onClick={async () => {
                  try {
                    await deleteReview.mutateAsync({ slug, reviewId: myReview.id! });
                    form.reset(defaultStoreReviewValues);
                    toast.success('Review removed');
                  } catch {
                    toast.error('Failed to delete review');
                  }
                }}
              >
                <IconTrash className='mr-1.5 h-4 w-4' />
                Delete
              </Button>
            )}
          </div>
        </form.Root>
      </form.AppForm>
    </div>
  );
}

export function StoreReviewForm({ slug }: StoreReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const { data: myReviewData, isLoading: isLoadingMine } = useGetStoresSlugReviewsMe(slug, {
    query: { enabled: isAuthenticated }
  });

  const myReview = (myReviewData as StoreReviewMeResponse | undefined)?.data ?? null;

  if (!isAuthenticated) {
    return (
      <div className='border-gold/15 bg-muted/20 rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground text-sm'>
          Sign in to share your experience with this store.
        </p>
        <Button asChild className='mt-4 rounded-full'>
          <Link href={`/login?callbackUrl=${encodeURIComponent(`/store/${slug}`)}`}>
            Sign in to review
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoadingMine) {
    return <StoreReviewFormSkeleton />;
  }

  return (
    <StoreReviewFormFields
      key={myReview?.id ?? 'new-review'}
      slug={slug}
      myReview={myReview}
    />
  );
}
