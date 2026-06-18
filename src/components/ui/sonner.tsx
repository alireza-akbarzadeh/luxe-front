'use client';
import {
  IconCheckbox,
  IconError404,
  IconInfoCircle,
  IconLoader2,
  IconTriangleSquareCircle
} from '@tabler/icons-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@/components/providers/client/theme';

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className='toaster group'
      icons={{
        success: <IconCheckbox className='size-4' />,
        info: <IconInfoCircle className='size-4' />,
        warning: <IconTriangleSquareCircle className='size-4' />,
        error: <IconError404 className='size-4' />,
        loading: <IconLoader2 className='size-4 animate-spin' />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
