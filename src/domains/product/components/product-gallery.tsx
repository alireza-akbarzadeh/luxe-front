'use client';
import { IconShare2 } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { Badge } from '~/src/components/ui/badge';

interface ProductGalleryProps {
  product: DtoProductWithLike;
  discount: number;
}

export function ProductGallery(props: ProductGalleryProps) {
  const { product, discount } = props;
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className='lg:sticky lg:top-32 lg:self-start'>
      <div className='bg-muted relative aspect-4/5 overflow-hidden rounded-2xl'>
        <AnimatePresence mode='wait'>
          <motion.img
            key={selectedImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={product?.images?.[selectedImage]}
            alt={product.name}
            className='h-full w-full object-cover'
          />
        </AnimatePresence>

        <div className='absolute top-4 left-4 flex flex-col gap-2'>
          {product.is_new && <Badge variant='inverse'>New Arrival</Badge>}
          {discount > 0 && <Badge variant='accent'>-{discount}% Off</Badge>}
        </div>

        <button
          onClick={() => toast('Link copied')}
          className='bg-background/85 hover:bg-background absolute top-4 right-4 rounded-full p-2.5 backdrop-blur transition'
        >
          <IconShare2 className='h-4 w-4' />
        </button>
      </div>

      <div className='mt-4 grid grid-cols-4 gap-3'>
        {product.images?.map((img: string, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
              selectedImage === i ? 'border-accent' : 'hover:border-border border-transparent'
            }`}
          >
            <Image fill src={img} alt={img} className='h-full w-full object-cover' />
          </button>
        ))}
      </div>
    </div>
  );
}
