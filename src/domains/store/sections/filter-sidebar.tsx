'use client';
import { motion } from 'framer-motion';
import { useStoresFilters } from '../hooks/useStoresFilter';
import { RATING_OPTIONS, SHIPPING_SPEED_OPTIONS, STORE_SIZE_OPTIONS } from '../constants';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='space-y-3'>
      <h3 className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
        {title}
      </h3>
      {children}
    </div>
  );
}
export function FilterSidebar({ inSheet = false }: { inSheet?: boolean }) {
  const { filters, setFilters, reset } = useStoresFilters();
  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={
        inSheet
          ? 'space-y-6'
          : 'border-border bg-card/40 glass sticky top-24 hidden h-[calc(100vh-7rem)] w-full space-y-6 overflow-y-auto rounded-2xl border p-5 lg:block'
      }
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>Filters</h2>
        <Button variant='ghost' size='sm' onClick={reset} className='h-7 px-2 text-xs'>
          Reset
        </Button>
      </div>
      <Section title='Location'>
        <Input
          value={filters.location}
          onChange={(e) => setFilters({ location: e.target.value, page: 1 })}
          placeholder='City or country'
          aria-label='Filter by location'
        />
      </Section>
      <Separator />
      <Section title='Verification & status'>
        <div className='space-y-2'>
          {[
            { key: 'verified', label: 'Verified only' },
            { key: 'freeShipping', label: 'Free shipping' },
            { key: 'newOnly', label: 'New stores' }
          ].map((opt) => (
            <label key={opt.key} className='flex cursor-pointer items-center gap-2 text-sm'>
              <Checkbox
                checked={filters[opt.key as 'verified' | 'freeShipping' | 'newOnly']}
                onCheckedChange={(v) => setFilters({ [opt.key]: !!v, page: 1 } as never)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Section>
      <Separator />
      <Section title='Rating'>
        <div className='space-y-1.5'>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className='flex cursor-pointer items-center gap-2 text-sm'>
              <input
                type='radio'
                name='rating'
                checked={filters.rating === r}
                onChange={() => setFilters({ rating: r, page: 1 })}
                className='accent-foreground'
              />
              {r}+ stars
            </label>
          ))}
          <label className='flex cursor-pointer items-center gap-2 text-sm'>
            <input
              type='radio'
              name='rating'
              checked={filters.rating === 0}
              onChange={() => setFilters({ rating: 0, page: 1 })}
              className='accent-foreground'
            />
            Any rating
          </label>
        </div>
      </Section>
      <Separator />
      <Section title='Shipping speed'>
        <Select
          value={filters.shippingSpeed}
          onValueChange={(v) => setFilters({ shippingSpeed: v, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHIPPING_SPEED_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>
      <Section title='Store size'>
        <Select
          value={filters.storeSize}
          onValueChange={(v) => setFilters({ storeSize: v, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STORE_SIZE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Section>
      <Separator />
      <Section title={`Min followers · ${filters.followersMin.toLocaleString()}`}>
        <Slider
          value={[filters.followersMin]}
          min={0}
          max={100000}
          step={1000}
          onValueChange={([v]) => setFilters({ followersMin: v, page: 1 })}
          aria-label='Minimum followers'
        />
      </Section>
    </motion.aside>
  );
}
