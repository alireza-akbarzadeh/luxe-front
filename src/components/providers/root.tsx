'use client';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/client/theme';
import { Toaster } from '@/components/ui/sonner';

import { DirectionProvider } from '../ui/direction';
import TanstackQueryProvider from './client/tanstack-query';

type TRootProvider = Readonly<PropsWithChildren>;

export default function RootProvider({ children }: TRootProvider) {
  return (
    <ThemeProvider defaultTheme='system'>
      <DirectionProvider dir='ltr'>
        <NuqsAdapter>
          <Toaster />
          <TanstackQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackQueryProvider>
        </NuqsAdapter>
      </DirectionProvider>
    </ThemeProvider>
  );
}
