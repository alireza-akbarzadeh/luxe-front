'use client';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';

import { useMediaDevices } from '~/src/hooks/useMediaDevices';

export function DevTools() {
  const { isMobile } = useMediaDevices();
  if (isMobile) return null;
  return (
    <TanStackDevtools
      config={{ position: 'bottom-right' }}
      plugins={[
        {
          name: 'React Query',
          render: <ReactQueryDevtoolsPanel />,
          defaultOpen: false
        },
        formDevtoolsPlugin()
      ]}
    />
  );
}
