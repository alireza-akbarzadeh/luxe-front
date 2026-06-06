import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckboxGroup } from '@/domains/orders/components/checkbox-group';
import { useOrdersQueryState } from '@/domains/orders/hooks/useOrderFilterQuery';
import {
  CHANNEL_OPTIONS,
  PAYMENT_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS
} from '@/domains/orders/mock_order';

interface OrdersAdvancedFilterProps {
  onClose: () => void;
}

export function OrdersAdvancedFilter({ onClose }: OrdersAdvancedFilterProps) {
  const {
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    channel,
    setChannel,
    priority,
    setPriority,
    minTotal,
    maxTotal,
    setTotalRange,
    resetAllFilters
  } = useOrdersQueryState();

  const activeCount =
    status.length +
    paymentStatus.length +
    channel.length +
    priority.length +
    (minTotal !== null || maxTotal !== null ? 1 : 0);

  const handleApply = () => {
    // Filters are already synced to URL via the hook's setters
    onClose();
  };

  const handleReset = async () => {
    await resetAllFilters();
    onClose();
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 space-y-6 overflow-y-auto p-6'>
        <CheckboxGroup
          label='Order Status'
          options={STATUS_OPTIONS as unknown as readonly string[]}
          selectedValues={status}
          onChange={setStatus}
        />
        <Separator />
        <CheckboxGroup
          label='Payment Status'
          options={PAYMENT_OPTIONS as unknown as readonly string[]}
          selectedValues={paymentStatus}
          onChange={setPaymentStatus}
        />
        <Separator />
        <CheckboxGroup
          label='Sales Channel'
          options={CHANNEL_OPTIONS as unknown as readonly string[]}
          selectedValues={channel}
          onChange={setChannel}
        />
        <Separator />
        <CheckboxGroup
          label='Priority'
          options={PRIORITY_OPTIONS as unknown as readonly string[]}
          selectedValues={priority}
          onChange={setPriority}
        />
        <Separator />
        <div className='space-y-3'>
          <Label className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
            Order Total Range
          </Label>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xs'>
                $
              </span>
              <Input
                value={minTotal ?? ''}
                onChange={(e) =>
                  setTotalRange(e.target.value === '' ? null : Number(e.target.value), maxTotal)
                }
                placeholder='0'
                className='pl-7 text-sm'
                type='number'
                min='0'
              />
            </div>
            <span className='text-muted-foreground text-xs font-bold'>—</span>
            <div className='relative flex-1'>
              <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-xs'>
                $
              </span>
              <Input
                value={maxTotal ?? ''}
                onChange={(e) =>
                  setTotalRange(minTotal, e.target.value === '' ? null : Number(e.target.value))
                }
                placeholder='∞'
                className='pl-7 text-sm'
                type='number'
                min='0'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='border-t p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <span className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
            {activeCount} filter{activeCount !== 1 ? 's' : ''} active
          </span>
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              className='text-destructive text-xs font-bold hover:underline'
            >
              Clear All
            </button>
          )}
        </div>
        <Button onClick={handleApply} className='w-full rounded-xl font-bold'>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
