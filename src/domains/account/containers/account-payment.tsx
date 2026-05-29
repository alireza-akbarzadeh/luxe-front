import { IconCreditCard, IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export function AccountPayment() {
  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>Payment Methods</h2>
      <div className='bg-muted/50 rounded-2xl py-12 text-center'>
        <IconCreditCard className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <h3 className='mb-2 font-semibold'>No payment methods</h3>
        <p className='text-muted-foreground mb-4'>Add a payment method for faster checkout</p>
        <Button>
          <IconPlus className='mr-2 h-4 w-4' />
          Add Payment Method
        </Button>
      </div>
    </div>
  );
}
