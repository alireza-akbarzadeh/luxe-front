import { IconMail, IconMapPin } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';

export interface CustomerAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string | number;
  country: string;
}

export interface CustomerOrderDetails {
  customer_name: string;
  customer_email: string;
  customer_avatar: string;
  shipping_address?: CustomerAddress | null;
  billing_address?: CustomerAddress | null;
  notes?: string | null;
}

export interface OrderCustomerCardProps {
  order: CustomerOrderDetails;
}

interface AddressBlockProps {
  title: string;
  address?: CustomerAddress | null;
}

// 3. Isolated Address Sub-component with Type Safety
function AddressBlock({ title, address }: AddressBlockProps) {
  if (!address?.line1) return null;
  return (
    <div className='space-y-1.5'>
      <p className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
        {title}
      </p>
      <div className='text-foreground text-xs leading-relaxed font-medium'>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
        <p className='text-foreground mt-0.5 font-bold'>{address.country}</p>
      </div>
    </div>
  );
}

export function OrderCustomerCard({ order }: OrderCustomerCardProps) {
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      order.customer_name
    )}&background=6d28d9&color=fff&size=48&bold=true`;
  };

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Customer
        </h2>
      </div>
      <div className='space-y-5 p-6'>
        {/* Profile Card Block */}
        <div className='flex items-center gap-3'>
          <Image
            width={48}
            height={48}
            src={order.customer_avatar}
            alt={order.customer_name}
            className='ring-border/40 h-12 w-12 rounded-full object-cover shadow-inner ring-2'
            onError={handleAvatarError}
          />
          <div className='min-w-0'>
            <p className='text-foreground truncate text-sm font-bold'>{order.customer_name}</p>
            <div className='text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs font-medium'>
              <IconMail className='text-muted-foreground/60 h-3.5 w-3.5 shrink-0' />
              <span className='truncate'>{order.customer_email}</span>
            </div>
          </div>
        </div>

        {/* Addresses Routing Block */}
        <div className='border-border/10 space-y-4 border-t pt-4'>
          <div className='flex items-start gap-2.5'>
            <IconMapPin className='text-muted-foreground/70 mt-0.5 h-4 w-4 shrink-0' />
            <div className='flex-1 space-y-5'>
              <AddressBlock title='Ship To' address={order.shipping_address} />
              <AddressBlock title='Bill To' address={order.billing_address} />
            </div>
          </div>
        </div>

        {/* Dynamic Notes Callout Banner */}
        {order.notes && (
          <div className='mt-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 dark:bg-amber-500/10'>
            <p className='mb-1 text-[10px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400'>
              Order Notes
            </p>
            <p className='text-xs leading-relaxed font-medium text-amber-900 dark:text-amber-200/90'>
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
