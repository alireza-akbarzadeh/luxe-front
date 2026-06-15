import { IconLayersIntersect2, IconPlus, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { CompareDialogContent } from '@/domains/compare/components/compare-dialog-content';

export function CompareEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='border-border/70 bg-muted/20 rounded-3xl border px-6 py-20 text-center'
    >
      <div className='bg-background mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border shadow-sm'>
        <IconLayersIntersect2 className='text-muted-foreground h-12 w-12' />
      </div>
      <h2 className='mb-2 text-2xl font-semibold'>No products to compare yet</h2>
      <p className='text-muted-foreground mx-auto mb-8 max-w-lg'>
        Add items from product pages using the compare icon, or browse the catalog and pick products
        to compare side by side.
      </p>

      <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
        <AppDialog
          title='Add products to compare'
          trigger={
            <Button size='lg' className='gap-2 rounded-full'>
              <IconPlus className='h-4 w-4' />
              Browse products
            </Button>
          }
        >
          <CompareDialogContent />
        </AppDialog>

        <Button asChild variant='outline' size='lg' className='gap-2 rounded-full'>
          <Link href='/shop'>
            <IconShoppingBag className='h-4 w-4' />
            Go to shop
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
