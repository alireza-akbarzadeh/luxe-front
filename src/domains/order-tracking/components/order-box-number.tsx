'use clinet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';

interface OrderBoxNumber {
  order_number: string;
}

export function OrderBoxNumebr(props: OrderBoxNumber) {
  const { order_number } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (order_number) {
      navigator.clipboard.writeText(order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className='mb-12'
    >
      <div className='bg-card border-border/50 rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground mb-2 text-sm'>Order Number</p>
        <div className='flex items-center justify-center gap-2'>
          <span className='font-mono text-2xl font-bold tracking-wider'>{order_number}</span>
          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full' onClick={handleCopy}>
            {copied ? (
              <IconCheck className='h-4 w-4 text-green-500' />
            ) : (
              <IconCopy className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
