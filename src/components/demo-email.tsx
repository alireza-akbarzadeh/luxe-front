'use client';
import { IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function DemoEmail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='bg-accent/10 border-accent/20 mb-6 rounded-xl border p-4'
    >
      <div className='flex items-start gap-3'>
        <IconCheck className='text-accent mt-0.5 h-5 w-5' />
        <div className='text-sm'>
          <p className='mb-1 font-medium'>Demo Account</p>
          <p className='text-muted-foreground'>
            Email: <span className='text-foreground font-mono'>demo@luxe.com</span>
          </p>
          <p className='text-muted-foreground'>
            Password: <span className='text-foreground font-mono'>demo123</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
