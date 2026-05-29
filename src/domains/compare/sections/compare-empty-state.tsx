import { Button } from '@/components/ui/button';
import { IconLayersIntersect2, IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AppDialog } from '@/components/app-dialog';
import { CompareDialogContent } from '@/domains/compare/components/compare-dialog-content';

export function CompareEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-20 text-center'
    >
      <div className='bg-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
        <IconLayersIntersect2 className='text-muted-foreground h-12 w-12' />
      </div>
      <h2 className='mb-2 text-2xl font-semibold'>No products to compare</h2>
      <p className='text-muted-foreground mx-auto mb-8 max-w-md'>
        Add products you want to compare by clicking the compare icon on any product card or use the
        button below.
      </p>
      <AppDialog
        title='Add Products to Compare'
        trigger={
          <Button size='lg' className='gap-2 rounded-full'>
            <IconPlus className='h-4 w-4' />
            Add Products to Compare
          </Button>
        }
      >
        <CompareDialogContent />
      </AppDialog>
    </motion.div>
  );
}
