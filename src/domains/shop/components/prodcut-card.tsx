import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';
import { IconShoppingBag, IconStar } from '@tabler/icons-react';
import { useCart } from '@/hooks/useCartController';
import type { ModelsProduct } from '~/src/services/-categories-bulk-post.schemas';
import { LikeButton } from '~/src/components/buttons/like-button';

interface ProductCardProps {
  product: ModelsProduct & {
    isLike: boolean;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isAdding } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultColor = product.colors?.[0]?.toString() || '';
    const defaultSize = product.sizes?.[0]?.toString() || '';

    if (!product.id) return;

    try {
      await addItem(product.id, 1, defaultColor || '', defaultSize || '');

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.id}`} className='group block'>
        <div className='bg-muted relative aspect-4/5 overflow-hidden rounded-xl'>
          <img
            src={product?.images?.[0] || '/placeholder.png'}
            alt={product.name}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          />

          <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
            {product.is_new && (
              <Badge className='bg-foreground text-background hover:bg-foreground'>New</Badge>
            )}
            {discountPercent > 0 && (
              <Badge
                variant='outline'
                className='border-accent bg-background/90 text-accent backdrop-blur'
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>
          <LikeButton
            isLiked={product.isLike}
            productId={product.id as number}
            productName={product.name || ''}
            className='bg-background/80 hover:bg-background absolute top-3 right-3 rounded-full p-2 opacity-0 backdrop-blur group-hover:opacity-100'
          />

          <div className='absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <Button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className='w-full gap-2 shadow-lg'
              size='sm'
            >
              <IconShoppingBag className='h-4 w-4' />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        <div className='mt-4 space-y-1.5'>
          <p className='text-muted-foreground text-xs tracking-widest uppercase'>
            {product.category?.name}
          </p>
          <h3 className='font-display group-hover:text-accent text-lg leading-tight transition-colors'>
            {product.name}
          </h3>
          <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            <IconStar className='fill-foreground text-foreground h-3.5 w-3.5' />
            <span>{product.rating}</span>
            <span>· {product.reviews_count} reviews</span>
          </div>
          <div className='flex items-baseline gap-2 pt-1'>
            <span className='text-base font-semibold'>${product.price}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className='text-muted-foreground text-sm line-through'>
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
