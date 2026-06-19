'use client';

import {
  IconArrowBackUp,
  IconChartBar,
  IconMessage,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconWallet
} from '@tabler/icons-react';
import { useState } from 'react';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'overview', label: 'Overview', icon: IconChartBar },
  { id: 'orders', label: 'Orders', icon: IconShoppingCart },
  { id: 'products', label: 'Products', icon: IconPackage },
  { id: 'customers', label: 'Customers', icon: IconUsers },
  { id: 'payouts', label: 'Payouts', icon: IconWallet },
  { id: 'returns', label: 'Returns', icon: IconArrowBackUp },
  { id: 'messages', label: 'Messages', icon: IconMessage }
] as const;

type TabId = (typeof TABS)[number]['id'];

const SAMPLE_ORDERS = [
  { id: '#LX-9281', customer: 'Sarah M.', total: '$184.00', status: 'Shipped' },
  { id: '#LX-9280', customer: 'David K.', total: '$92.50', status: 'Processing' },
  { id: '#LX-9279', customer: 'Amira L.', total: '$310.00', status: 'Delivered' }
];

export function VendorDashboardShowcaseSection() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <LandingContainer id='dashboard' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle
          eyebrow='Vendor dashboard'
          title='Your entire business, one beautiful workspace'
          description='Orders, revenue, inventory, messages, and payouts — designed for clarity and speed.'
        />
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className='border-border/50 bg-card/40 overflow-hidden rounded-3xl border shadow-2xl shadow-black/5 backdrop-blur'>
          <div className='border-border/50 flex gap-1 overflow-x-auto border-b p-2'>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-gold/15 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
                aria-pressed={activeTab === tab.id}
              >
                <tab.icon className='size-3.5' aria-hidden />
                {tab.label}
              </button>
            ))}
          </div>

          <div className='p-6 md:p-8'>
            {activeTab === 'overview' && <OverviewPanel />}
            {activeTab === 'orders' && <OrdersPanel />}
            {activeTab === 'products' && <ProductsPanel />}
            {activeTab === 'customers' && <CustomersPanel />}
            {activeTab === 'payouts' && <PayoutsPanel />}
            {activeTab === 'returns' && <ReturnsPanel />}
            {activeTab === 'messages' && <MessagesPanel />}
          </div>
        </div>
      </FadeInView>
    </LandingContainer>
  );
}

function OverviewPanel() {
  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='lg:col-span-2'>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[
            { label: 'Revenue', value: '$48,290' },
            { label: 'Orders', value: '1,284' },
            { label: 'AOV', value: '$76.40' },
            { label: 'Conversion', value: '3.8%' }
          ].map((stat) => (
            <div key={stat.label} className='border-border/40 bg-muted/20 rounded-2xl border p-4'>
              <p className='text-muted-foreground text-xs'>{stat.label}</p>
              <p className='mt-1 text-xl font-semibold'>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className='border-border/40 bg-muted/20 mt-4 rounded-2xl border p-4'>
          <p className='mb-3 text-sm font-medium'>Weekly performance</p>
          <div className='flex h-32 items-end gap-2'>
            {[40, 55, 48, 72, 65, 88, 92].map((h, i) => (
              <div key={i} className='flex flex-1 flex-col items-center gap-1'>
                <div className='bg-gold/60 w-full rounded-t-md' style={{ height: `${h}%` }} />
                <span className='text-muted-foreground text-[10px]'>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='border-border/40 bg-muted/20 rounded-2xl border p-4'>
        <p className='mb-3 text-sm font-medium'>Recent activity</p>
        <ul className='space-y-3 text-sm'>
          <li className='flex justify-between gap-2'>
            <span>New order #LX-9281</span>
            <span className='text-muted-foreground'>2m</span>
          </li>
          <li className='flex justify-between gap-2'>
            <span>Payout initiated</span>
            <span className='text-muted-foreground'>1h</span>
          </li>
          <li className='flex justify-between gap-2'>
            <span>Low stock alert</span>
            <span className='text-muted-foreground'>3h</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function OrdersPanel() {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[480px] text-left text-sm'>
        <thead>
          <tr className='text-muted-foreground border-border/50 border-b text-xs'>
            <th className='pb-3 font-medium'>Order</th>
            <th className='pb-3 font-medium'>Customer</th>
            <th className='pb-3 font-medium'>Total</th>
            <th className='pb-3 font-medium'>Status</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ORDERS.map((order) => (
            <tr key={order.id} className='border-border/30 border-b last:border-0'>
              <td className='py-3 font-medium'>{order.id}</td>
              <td className='py-3'>{order.customer}</td>
              <td className='py-3 tabular-nums'>{order.total}</td>
              <td className='py-3'>
                <span className='bg-muted rounded-full px-2 py-0.5 text-xs'>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsPanel() {
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {['Linen Blazer', 'Silk Scarf', 'Leather Tote'].map((name, i) => (
        <div key={name} className='border-border/40 flex gap-3 rounded-2xl border p-3'>
          <div className='bg-muted size-14 shrink-0 rounded-xl' />
          <div>
            <p className='text-sm font-medium'>{name}</p>
            <p className='text-muted-foreground text-xs'>{120 - i * 15} in stock</p>
            <p className='text-gold mt-1 text-sm font-medium'>${(89 + i * 40).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CustomersPanel() {
  return (
    <ul className='space-y-3'>
      {['Sarah M.', 'David K.', 'Amira L.', 'Tom R.'].map((name) => (
        <li
          key={name}
          className='border-border/40 flex items-center justify-between rounded-xl border px-4 py-3 text-sm'
        >
          <span>{name}</span>
          <span className='text-muted-foreground text-xs'>3 orders · $420 LTV</span>
        </li>
      ))}
    </ul>
  );
}

function PayoutsPanel() {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <div className='border-border/40 bg-muted/20 rounded-2xl border p-5'>
        <p className='text-muted-foreground text-xs'>Available balance</p>
        <p className='mt-1 text-3xl font-semibold'>$12,840.00</p>
        <p className='text-muted-foreground mt-2 text-xs'>Next payout · Friday</p>
      </div>
      <div className='border-border/40 rounded-2xl border p-5'>
        <p className='mb-3 text-sm font-medium'>Recent payouts</p>
        <ul className='text-muted-foreground space-y-2 text-sm'>
          <li className='flex justify-between'>
            <span>Mar 8</span>
            <span className='text-foreground'>$9,210.00</span>
          </li>
          <li className='flex justify-between'>
            <span>Feb 22</span>
            <span className='text-foreground'>$8,440.00</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ReturnsPanel() {
  return (
    <ul className='space-y-3 text-sm'>
      <li className='border-border/40 flex justify-between rounded-xl border px-4 py-3'>
        <span>#RMA-1042 · Size exchange</span>
        <span className='text-muted-foreground'>Pending</span>
      </li>
      <li className='border-border/40 flex justify-between rounded-xl border px-4 py-3'>
        <span>#RMA-1041 · Refund</span>
        <span className='text-emerald-600 dark:text-emerald-400'>Completed</span>
      </li>
    </ul>
  );
}

function MessagesPanel() {
  return (
    <ul className='space-y-3'>
      {[
        { from: 'Sarah M.', preview: 'When will my order ship?', time: '5m' },
        { from: 'David K.', preview: 'Can I change the delivery address?', time: '2h' }
      ].map((msg) => (
        <li key={msg.from} className='border-border/40 rounded-xl border p-4'>
          <div className='flex justify-between gap-2'>
            <p className='text-sm font-medium'>{msg.from}</p>
            <span className='text-muted-foreground text-xs'>{msg.time}</span>
          </div>
          <p className='text-muted-foreground mt-1 text-sm'>{msg.preview}</p>
        </li>
      ))}
    </ul>
  );
}
