import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '~/src/components/ui/button';

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-16 text-center'
    >
      <div className='bg-muted/50 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
        <IconChevronRight className='text-muted-foreground h-12 w-12' />
      </div>
      <h2 className='mb-2 text-2xl font-semibold'>Your cart is empty</h2>
      <p className='text-muted-foreground mx-auto mb-8 max-w-md'>
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
      </p>
      <Link href='/shop'>
        <Button size='lg' className='rounded-full px-8'>
          Continue Shopping
          <IconChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </Link>
    </motion.div>
  );
}
