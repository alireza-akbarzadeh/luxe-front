import { Flex } from '@/components/ui/flex';
import { COMMERCE_SNAP_POINTS } from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

/** Three-dot indicator for commerce snap drawers (cart, checkout, PDP). */
export function CommerceSnapLevelDots({ activeIndex }: { activeIndex: number }) {
  return (
    <Flex direction='row' align='center' justify='center' gap={1.5} className='py-1' aria-hidden>
      {COMMERCE_SNAP_POINTS.map((point, index) => (
        <span
          key={String(point)}
          className={cn(
            'bg-muted-foreground/25 h-1 rounded-full transition-all duration-200',
            index === activeIndex ? 'bg-primary w-5' : 'w-1.5'
          )}
        />
      ))}
    </Flex>
  );
}
