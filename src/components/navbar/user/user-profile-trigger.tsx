'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { useNavbarProfile } from '@/components/navbar/user/useNavbarProfile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UserProfileTriggerProps = ComponentPropsWithoutRef<'button'>;

export function UserProfileTrigger(props: UserProfileTriggerProps) {
  const { avatarFallback, statusDot } = useNavbarProfile();

  return (
    <Button
      variant='outline'
      size='icon'
      aria-label='Account menu'
      className={cn(
        'group focus-visible:ring-gold/40 relative h-8 w-8 rounded-xl outline-none focus-visible:ring-2',
        'border-border/70 bg-card/80 hover:bg-muted/60 backdrop-blur-sm',
        'dark:border-border/60 dark:bg-card/40 dark:hover:bg-muted/30'
      )}
      {...props}
    >
      <div className='relative'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br shadow-sm ring-1',
            'from-accent via-gold to-gold-strong text-accent-foreground ring-gold/25',
            'dark:from-primary dark:via-primary/95 dark:to-secondary dark:text-primary-foreground dark:ring-border/80'
          )}
        >
          <span className='font-display text-[10px] leading-none font-bold'>{avatarFallback}</span>
        </motion.div>

        <span
          className={cn(
            'border-background absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border',
            statusDot
          )}
          aria-hidden
        />
      </div>
    </Button>
  );
}
