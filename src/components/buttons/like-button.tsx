'use client';

import { IconHeart } from '@tabler/icons-react';
import React from 'react';

import { useLikeProduct } from '@/components/buttons/useUpdateLike';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { cn } from '~/src/hooks/useContextFactory';

import { Button } from '../ui/button';

interface Props {
  productId: number;
  productName: string;
  isLiked: boolean;
  className?: string;
}

export function LikeButton({ productId, productName, isLiked, className }: Props) {
  const likeMutation = useLikeProduct(productName);
  const { requireAuth } = useRequireAuth();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth({ reason: 'like-product' })) {
      return;
    }

    likeMutation.mutate({
      id: productId,
      data: {
        like: !isLiked
      }
    });
  };

  const optimisticLiked = (
    likeMutation.variables?.id === productId ? likeMutation.variables.data.like : isLiked
  ) as boolean;

  return (
    <Button
      type='button'
      size='icon'
      variant='outline'
      onClick={handleClick}
      disabled={likeMutation.isPending}
      aria-label='Wishlist'
      className={cn('transition-all duration-200 hover:scale-105 active:scale-95', className)}
    >
      <IconHeart
        className={cn(
          'h-5 w-5 transition-all duration-200',
          optimisticLiked && 'fill-red-500 text-red-500'
        )}
      />
    </Button>
  );
}
