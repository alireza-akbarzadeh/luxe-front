'use client';
import { IconCheck,IconDiscount2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';

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

export function AvailableCoupons(props: AvailableCouponsProps) {
  const { applicableCoupons, selectedCouponCode, isApplyingCoupon, onSelectCoupon } = props;

  if (!applicableCoupons.length) return null;

  const handleSelectCoupon = (code: string) => {
    if (selectedCouponCode === code) return;
    onSelectCoupon(code);
  };

  return (
    <Accordion type='single' collapsible className='w-full pt-2'>
      <AccordionItem value='coupons'>
        <AccordionTrigger className='text-sm font-medium'>
          <motion.span
            className='bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent'
            style={{ backgroundSize: '200% 100%' }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            View available Coupons ({applicableCoupons.length})
          </motion.span>
        </AccordionTrigger>
        <AccordionContent>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {applicableCoupons.map((coupon, index) => {
              const isSelected = selectedCouponCode === coupon.code;

              return (
                <motion.button
                  key={coupon.id}
                  type='button'
                  onClick={() => handleSelectCoupon(coupon.code)}
                  disabled={isApplyingCoupon || isSelected}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-accent/10 border-accent ring-accent/20 ring-2'
                      : 'bg-background border-border hover:border-accent/50'
                  } ${isApplyingCoupon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 shrink-0 rounded-full p-1.5 ${
                      isSelected ? 'bg-accent/20' : 'bg-green-100'
                    }`}
                  >
                    {isSelected ? (
                      <IconCheck className='text-accent h-4 w-4' />
                    ) : (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <IconDiscount2 className='h-4 w-4 text-green-600' />
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='relative z-10 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-mono text-sm font-semibold'>{coupon.code}</span>

                      {/* Animated discount text */}
                      <motion.span
                        className='bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-sm font-bold text-transparent'
                        style={{ backgroundSize: '200% 100%' }}
                        animate={{
                          backgroundPosition: ['0% 0%', '200% 0%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      >
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% OFF`
                          : `$${coupon.discount_value} OFF`}
                      </motion.span>
                    </div>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      {coupon.description || `Min. order $${coupon.minimum_order_amount || 0}`}
                    </p>
                    {isSelected && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-accent mt-1 text-xs font-medium'
                      >
                        ✓ Applied
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
