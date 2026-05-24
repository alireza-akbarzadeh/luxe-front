'use client';

import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-clinet';
import { DevTools } from '@/components/providers/DevTools';

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
