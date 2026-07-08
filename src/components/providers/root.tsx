'use client';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';

import { AppUpdateNotifier } from '@/components/providers/app-update-notifier';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/client/theme';
import { ConnectivityNotifier } from '@/components/providers/connectivity-notifier';
import { Toaster } from '@/components/ui/sonner';

import { DirectionProvider } from '../ui/direction';
import TanstackQueryProvider from './client/tanstack-query';

type TRootProvider = Readonly<
  PropsWithChildren<{
    dir: 'ltr' | 'rtl';
  }>
>;

export default function RootProvider({ children, dir }: TRootProvider) {
  return (
    <ThemeProvider defaultTheme='dark'>
      <DirectionProvider dir={dir}>
        <NuqsAdapter>
          <Toaster />
          <ConnectivityNotifier />
          <AppUpdateNotifier />
          <TanstackQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackQueryProvider>
        </NuqsAdapter>
      </DirectionProvider>
    </ThemeProvider>
  );
}
