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
import {
  CUSTOMER_SEGMENT_OPTIONS,
  type CustomerSegment
} from '@/domains/customers-admin/lib/customer-segments';
import { useMediaDevices } from '@/hooks/useMediaDevices';

interface CustomerSegmentPickerProps {
  value: CustomerSegment;
  onSelect: (segment: CustomerSegment) => void;
}

function SegmentTrigger({ label }: { label: string }) {
  return (
    <Button
      variant='outline'
      size='sm'
      className='border-border/60 hover:bg-background h-10 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
    >
      <IconFilter className='text-primary h-3.5 w-3.5' />
      Segment: {label}
      <IconChevronDown className='h-3 w-3 opacity-50' />
    </Button>
  );
}

export function CustomerSegmentPicker({ value, onSelect }: CustomerSegmentPickerProps) {
  const { isDesktop } = useMediaDevices();
  const label = CUSTOMER_SEGMENT_OPTIONS.find((option) => option.id === value)?.label ?? 'All';

  const options = (
    <Flex direction='column' className='gap-1'>
      {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
        <Button
          key={option.id || 'all'}
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
        title='Customer segment'
        description='Filter by CRM segment.'
        trigger={<SegmentTrigger label={label} />}
      >
        {options}
      </AppDialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SegmentTrigger label={label} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='border-border/40 w-48 rounded-xl p-1 shadow-2xl'>
        {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id || 'all'}
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
