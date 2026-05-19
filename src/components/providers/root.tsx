'use client';
import type { PropsWithChildren } from 'react';

import TanstackQueryProvider from './client/tanstack-query';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import {ThemeProvider} from './client/theme';
import { DirectionProvider } from '../ui/direction';

type TRootProvider = Readonly<PropsWithChildren>;

export default function RootProvider({ children }: TRootProvider) {
  return (
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <DirectionProvider dir='ltr'>
        <NuqsAdapter>
          <Toaster />
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NuqsAdapter>
      </DirectionProvider>
    </ThemeProvider>
  );
}
