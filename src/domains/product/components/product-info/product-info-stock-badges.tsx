import { IconPackage } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductInfoStockBadgesProps {
  product: DtoProductWithLike;
  stock: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function ProductInfoStockBadges({
  product,
  stock,
  isOutOfStock,
  isLowStock
}: ProductInfoStockBadgesProps) {
  const t = useTranslations('pdp.info');
  const tCard = useTranslations('shop.productCard');

  return (
    <div className='flex flex-wrap gap-2'>
      {isOutOfStock ? (
        <Badge variant='destructive' className='rounded-full px-3 py-1'>
          {tCard('outOfStock')}
        </Badge>
      ) : isLowStock ? (
        <Badge variant='outline' className='rounded-full px-3 py-1'>
          {tCard('onlyLeft', { count: stock })}
        </Badge>
      ) : (
        <Badge variant='secondary' className='gap-1.5 rounded-full px-3 py-1'>
          <IconPackage className='h-3.5 w-3.5' />
          {t('inStock')}
        </Badge>
      )}
      {product.is_digital ? (
        <Badge variant='outline' className='rounded-full px-3 py-1'>
          {t('instantDownload')}
        </Badge>
      ) : null}
    </div>
  );
}
