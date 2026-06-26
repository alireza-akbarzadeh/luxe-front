'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import type { AdminStoreSummary } from '@/lib/api/vendor-stores';

interface ApplicationDetailSheetProps {
  store: AdminStoreSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (store: AdminStoreSummary) => void;
  onReject: (store: AdminStoreSummary) => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Flex direction='row' justify='between' align='start' fullWidth className='gap-4'>
      <Typography.Muted className='text-xs'>{label}</Typography.Muted>
      <Typography.Text className='max-w-[65%] text-right text-sm'>{value}</Typography.Text>
    </Flex>
  );
}

export function ApplicationDetailSheet({
  store,
  open,
  onOpenChange,
  onApprove,
  onReject
}: ApplicationDetailSheetProps) {
  if (!store) return null;

  const settings = store.settings ?? {};

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>{store.name}</SheetTitle>
          <SheetDescription>Vendor application review</SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={4} className='mt-6'>
          <Badge variant='secondary' className='w-fit capitalize'>
            {store.status}
          </Badge>

          <Flex direction='column' spacing={3}>
            <DetailRow label='Owner' value={store.owner_email} />
            <DetailRow label='Location' value={store.location} />
            <DetailRow label='Legal name' value={settings['business_legal_name']} />
            <DetailRow label='Business type' value={settings['business_type']} />
            <DetailRow label='Country' value={settings['country']} />
            <DetailRow label='Website' value={settings['website']} />
            <DetailRow label='Tax ID' value={settings['tax_id']} />
            <DetailRow label='Fulfillment' value={settings['fulfillment_model']} />
            <DetailRow label='Latitude' value={settings['latitude']} />
            <DetailRow label='Longitude' value={settings['longitude']} />
          </Flex>

          <Flex direction='row' spacing={2} justify='end' className='pt-4'>
            <Button type='button' variant='outline' onClick={() => onReject(store)}>
              Reject
            </Button>
            <Button type='button' onClick={() => onApprove(store)}>
              Approve
            </Button>
          </Flex>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
