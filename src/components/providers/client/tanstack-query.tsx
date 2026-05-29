'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { DevTools } from '@/components/providers/DevTools';
import { getQueryClient } from '~/src/lib/query-client';

type TTanstackQueryProvider = Readonly<PropsWithChildren>;

export default function TanstackQueryProvider({ children }: TTanstackQueryProvider) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DevTools />
    </QueryClientProvider>
  );
}
