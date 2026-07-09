'use client';

import { IconChevronDown, IconFilter } from '@tabler/icons-react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { useMediaDevices } from '@/hooks/useMediaDevices';

type UserSegment = 'all' | 'active' | 'inactive' | 'admins';

const SEGMENT_OPTIONS: Array<{ id: UserSegment; label: string; className?: string }> = [
  { id: 'all', label: 'All Users' },
  { id: 'active', label: 'Active Users', className: 'text-emerald-600' },
  { id: 'inactive', label: 'Inactive Users', className: 'text-muted-foreground' },
  { id: 'admins', label: 'Admins', className: 'text-primary' }
];

interface UserSegmentPickerProps {
  hasCustomFilters: boolean;
  onSelect: (segment: UserSegment) => void;
}

function SegmentTrigger({ hasCustomFilters }: { hasCustomFilters: boolean }) {
  return (
    <Button
      variant='outline'
      size='sm'
      className='border-border/60 hover:bg-background h-10 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
    >
      <IconFilter className='text-primary h-3.5 w-3.5' />
      Segment: {hasCustomFilters ? 'Custom' : 'All'}
      <IconChevronDown className='h-3 w-3 opacity-50' />
    </Button>
  );
}

export function UserSegmentPicker({ hasCustomFilters, onSelect }: UserSegmentPickerProps) {
  const { isDesktop } = useMediaDevices();

  const options = (
    <Flex direction='column' className='gap-1'>
      {SEGMENT_OPTIONS.map((option) => (
        <Button
          key={option.id}
          variant='ghost'
          className={`h-10 justify-start rounded-xl text-[10px] font-bold uppercase ${option.className ?? ''}`}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );

  if (!isDesktop) {
    return (
      <AppDialog
        title='User segment'
        description='Quick filter presets.'
        trigger={<SegmentTrigger hasCustomFilters={hasCustomFilters} />}
      >
        {options}
      </AppDialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SegmentTrigger hasCustomFilters={hasCustomFilters} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='border-border/40 w-48 rounded-xl p-1 shadow-2xl'>
        {SEGMENT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`py-2 text-[10px] font-bold uppercase ${option.className ?? ''}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
