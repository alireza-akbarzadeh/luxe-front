'use client';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ThemeMenuItem() {
  const { setTheme, theme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className='group hover:bg-accent/60 flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all'
    >
      <div className='bg-muted group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl transition-colors'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? (
              <IconSun size={18} className='text-foreground' />
            ) : (
              <IconMoon size={18} className='text-foreground' />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='flex-1 text-left'>
        <span className='text-sm font-medium'>Appearance</span>
        <span className='text-muted-foreground block text-xs'>Switch between light & dark</span>
      </div>
    </button>
  );
}
