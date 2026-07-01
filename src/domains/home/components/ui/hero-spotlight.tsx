import Image from 'next/image';
import Link from 'next/link';

import { mapHomeProductItem } from '@/domains/home/lib/home-utils';

interface HeroSpotlightProps {
  products: ReturnType<typeof mapHomeProductItem>[];
}

/** Server-rendered hero product grid — no client fetch (improves LCP / TBT). */
export function HeroSpotlight({ products }: HeroSpotlightProps) {
  if (products.length === 0) return null;

  const [heroProduct, ...tileProducts] = products;

  const heroImage = heroProduct?.images?.[0] || '/placeholder.svg';
  const heroName = heroProduct?.name;
  const heroPrice = heroProduct?.price;

  return (
    <div className='grid grid-cols-12 gap-3 sm:gap-4'>
      <div className='border-gold/20 relative col-span-7 aspect-[4/5] overflow-hidden rounded-3xl border shadow-2xl'>
        <Image
          src={heroImage}
          alt={heroName || 'Hero product image'}
          fill
          priority
          fetchPriority='high'
          sizes='(max-width: 1024px) 60vw, 35vw'
          className='object-cover'
        />
        <div
          aria-hidden
          className='from-foreground/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent'
        />
        <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
          <p className='text-gold text-[0.7rem] tracking-[0.25em] uppercase'>Editor&apos;s pick</p>
          <p className='font-display text-primary-foreground mt-1 text-lg font-medium sm:text-xl'>
            {heroName}
          </p>
          <p className='text-primary-foreground/90 mt-1 text-sm'>{heroPrice}</p>
        </div>
      </div>

      <div className='col-span-5 flex flex-col gap-3 sm:gap-4'>
        {tileProducts.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className='group border-gold/15 bg-card hover:border-gold/40 relative aspect-square overflow-hidden rounded-3xl border shadow-lg transition-colors'
          >
            <Image
              src={product.images?.[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes='(max-width: 1024px) 25vw, 18vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div
              aria-hidden
              className='from-foreground/60 absolute inset-0 bg-gradient-to-t to-transparent opacity-80'
            />
            <div className='absolute inset-x-3 bottom-3'>
              <p className='text-primary-foreground line-clamp-1 text-xs font-medium sm:text-sm'>
                {product.name}
              </p>
              <p className='text-primary-foreground/85 text-[0.7rem]'>{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
