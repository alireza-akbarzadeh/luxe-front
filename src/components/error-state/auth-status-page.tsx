'use client';

import { IconHome, IconLock, IconLogin, IconUserCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type AuthStatusVariant = 'forbidden' | 'unauthorized';

export function AuthStatusPage({ variant }: { variant: AuthStatusVariant }) {
  const t = useTranslations(`errors.global.${variant}`);
  const tCommon = useTranslations('errors.common');

  const code = variant === 'forbidden' ? '403' : '401';
  const Icon = variant === 'forbidden' ? IconLock : IconUserCircle;
  const iconClass = variant === 'forbidden' ? 'text-warning' : 'text-primary';
  const iconBg = variant === 'forbidden' ? 'bg-warning/10' : 'bg-primary/10';

  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='border-0 shadow-xl'>
          <CardContent className='flex flex-col items-center p-8 text-center'>
            <motion.div
              animate={variant === 'forbidden' ? { scale: [1, 1.1, 1] } : { x: [0, -5, 5, -5, 0] }}
              transition={
                variant === 'forbidden'
                  ? { repeat: Infinity, duration: 2 }
                  : { duration: 0.4, delay: 0.1 }
              }
              className={`mb-6 rounded-full p-4 ${iconBg}`}
            >
              <Icon size={48} className={iconClass} />
            </motion.div>
            <h1 className='text-foreground text-6xl font-bold tracking-tight'>{code}</h1>
            <h2 className='mt-2 text-2xl font-semibold'>{t('title')}</h2>
            <p className='text-muted-foreground mt-2'>{t('description')}</p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              {variant === 'forbidden' ? (
                <>
                  <Button asChild variant='default'>
                    <Link href='/'>
                      <IconHome className='mr-2 h-4 w-4' />
                      {tCommon('home')}
                    </Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/login'>
                      <IconLogin className='mr-2 h-4 w-4' />
                      {tCommon('signIn')}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant='default'>
                    <Link href='/login'>
                      <IconLogin className='mr-2 h-4 w-4' />
                      {tCommon('logIn')}
                    </Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/'>
                      <IconHome className='mr-2 h-4 w-4' />
                      {tCommon('backToHome')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
