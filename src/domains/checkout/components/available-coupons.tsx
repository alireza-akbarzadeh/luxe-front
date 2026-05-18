import { IconDiscount2 } from '@tabler/icons-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/src/components/ui/accordion';
import type { ModelsCoupon } from '~/src/services/-coupons-get.schemas';

interface AvailableCouponsProps {
  applicableCoupons: ModelsCoupon[];
  selectedCouponCode: string;
  isApplyingCoupon: boolean;
  onSelectCoupon: (code: string) => void;
}

export function AvailableCoupons({
  applicableCoupons,
  selectedCouponCode,
  isApplyingCoupon,
  onSelectCoupon
}: AvailableCouponsProps) {
  if (!applicableCoupons.length) return null;

  const handleSelectCoupon = (code: string) => {
    if (selectedCouponCode === code) return;
    onSelectCoupon(code);
  };

  return (
    <Accordion type='single' collapsible className='w-full pt-2'>
      <AccordionItem value='coupons'>
        <AccordionTrigger className='text-sm font-medium'>View available Coupons</AccordionTrigger>
        <AccordionContent>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {applicableCoupons.map((coupon) => (
              <button
                key={coupon.id}
                type='button'
                onClick={() => handleSelectCoupon(coupon.code)}
                disabled={isApplyingCoupon}
                className={`bg-background hover:border-accent/50 flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                  selectedCouponCode === coupon.code ? 'border-accent bg-accent/5' : 'border-border'
                }`}
              >
                <div className='shrink-0 rounded-full bg-green-100 p-1.5'>
                  <IconDiscount2 className='h-4 w-4 text-green-600' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-mono text-sm font-semibold'>{coupon.code}</span>
                    <span className='text-accent text-sm font-bold'>
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `$${coupon.discount_value} OFF`}
                    </span>
                  </div>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    {coupon.description || `Min. order $${coupon.minimum_order_amount || 0}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
