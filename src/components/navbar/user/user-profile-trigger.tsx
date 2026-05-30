'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';
import { useNavbarProfile } from '~/src/components/navbar/user/useNavbarProfile';

type UserProfileTriggerProps = ComponentPropsWithoutRef<'button'>;

export function UserProfileTrigger(props: UserProfileTriggerProps) {
  const { avatarFallback, statusDot } = useNavbarProfile();

  return (
    <button
      className={cn(
        'group relative outline-none',
        'focus-visible:ring-primary/40 rounded-2xl focus-visible:ring-2'
      )}
      {...props}
    >
      {/* Avatar */}
      <div className='relative'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            'from-primary via-primary/80 to-secondary flex items-center justify-center rounded-xl bg-linear-to-br shadow-lg',
            // 🔥 responsive sizing (IMPORTANT FIX)
            'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11',
            'rounded-xl md:rounded-2xl'
          )}
        >
          <span className='text-xs font-bold text-white sm:text-sm'>{avatarFallback}</span>
        </motion.div>

        {/* status dot */}
        <div
          className={cn(
            'border-background absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 sm:h-3 sm:w-3',
            statusDot
          )}
        />
      </div>
    </button>
  );
}
