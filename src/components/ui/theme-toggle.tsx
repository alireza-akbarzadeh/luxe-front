'use client';

import { IconDeviceLaptop, IconMoonStars, IconSun } from '@tabler/icons-react';
import type { ComponentProps } from 'react';

import { useTheme } from '@/components/providers/client/theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ThemeToggleProps {
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
}

export default function ThemeToggle({ className, variant = 'outline' }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid='theme-toggle' variant={variant} size='icon' className={className}>
          <IconSun className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <IconMoonStars className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-testid='theme-dropdown-content' align='end' className='min-w-24'>
        <DropdownMenuItem
          data-testid='theme-light'
          onClick={() => {
            setTheme('light');
          }}
        >
          <IconSun className='size-4' />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid='theme-dark'
          onClick={() => {
            setTheme('dark');
          }}
        >
          <IconMoonStars className='size-4' />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid='theme-system'
          onClick={() => {
            setTheme('system');
          }}
        >
          <IconDeviceLaptop className='size-4' />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
