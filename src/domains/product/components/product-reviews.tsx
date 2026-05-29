import { IconCheck, IconStar } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '~/src/components/ui/badge';
import type { DtoProductResponse } from '~/src/services/-products-get.schemas';
import { useGetReviews } from '~/src/services/-reviews-get';
import { IconLoader2 } from '@tabler/icons-react';

interface ProductReviewsProps {
  product: DtoProductResponse;
  productId: string;
}

export default function ProductReviews(props: ProductReviewsProps) {
  const { product, productId } = props;
  const { data, isLoading } = useGetReviews({ product_id: Number(productId), limit: 10 });
  const reviews = data?.data?.reviews;

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <IconLoader2 className='text-primary h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <>
      <div>
        <p className='font-display text-5xl'>{product.rating}</p>
        <div className='mt-2 flex'>
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.rating || 0)
                  ? 'fill-foreground text-foreground'
                  : 'text-muted-foreground/40'
              }`}
            />
          ))}
        </div>
        <p className='text-muted-foreground mt-2 text-sm'>
          Based on {product.reviews_count} reviews
        </p>
        <div className='mt-6 space-y-1.5'>
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
            return (
              <div key={stars} className='flex items-center gap-2 text-xs'>
                <span className='text-muted-foreground w-12'>{stars} star</span>
                <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
                  <div className='bg-foreground h-full' style={{ width: `${pct}%` }} />
                </div>
                <span className='text-muted-foreground w-8 text-right'>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <ul className='space-y-6'>
          {reviews.map((r) => (
            <li key={r.id} className='border-border border-b pb-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='font-medium'>{r.author}</p>
                  {r.is_verified && (
                    <Badge variant='outline' className='gap-1 text-[10px]'>
                      <IconCheck className='h-2.5 w-2.5' /> Verified
                    </Badge>
                  )}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {formatDistanceToNow(new Date(r.created_at as string))}
                </p>
              </div>
              <div className='mt-2 flex'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Number(r.rating)
                        ? 'fill-foreground text-foreground'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                ))}
              </div>
              <p className='mt-2 font-medium'>{r.title}</p>
              <p className='text-muted-foreground mt-1 text-sm'>{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-muted-foreground py-8 text-center'>
          No reviews yet. Be the first to review!
        </p>
      )}
    </>
  );
}
