'use client';

import {
  IconChevronRight,
  IconCreditCard,
  IconEdit,
  IconHeart,
  IconHome,
  IconMapPin,
  IconPackage
} from '@tabler/icons-react';
import { useState } from 'react';

import { Button } from '~/src/components/ui/button';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';

import { AccountProfileForm } from '../components/account-profile-form';
import { statusColors } from '../data';
import { useSidebarTab } from '../hooks/useSidebarTab';

export function AccountOverview() {
  const { setActiveTab } = useSidebarTab();
  const [isEditing, setIsEditing] = useState(false);

  const { data: summaryData, isLoading, error } = useGetAccountSummary();

  const user = summaryData?.data;
  const defaultShipping = user?.default_shipping_address;
  const defaultBilling = user?.default_billing_address;

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  // Format address for display
  const formatAddress = (address: any) => {
    if (!address) return 'No address set';
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Extract summary data
  const addressCount = summaryData?.data?.address_count ?? 0;
  const likedProductsCount = summaryData?.data?.liked_products_count ?? 0;
  const recentOrders = summaryData?.data?.recent_orders ?? [];

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='bg-card border-border h-32 rounded-2xl border p-6' />
        <div className='grid grid-cols-3 gap-4'>
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
          <div className='bg-card border-border h-24 rounded-xl border p-6' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-card border-border rounded-2xl border p-6 text-center'>
        <p className='text-destructive'>Failed to load dashboard data. Please try again later.</p>
        <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='bg-card border-border rounded-2xl border p-6 text-center'>
        <p className='text-muted-foreground'>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Profile Card */}
      <div className='bg-card border-border rounded-2xl border p-6'>
        <div className='mb-6 flex items-start justify-between'>
          <h2 className='text-xl font-semibold'>Profile Information</h2>
          {isEditing ? (
            <Button variant='ghost' size='sm' onClick={handleCancelEditing}>
              <IconEdit className='mr-2 h-4 w-4' />
              Cancel
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant='ghost' size='sm'>
              <IconEdit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          )}
        </div>

        <AccountProfileForm
          open={isEditing}
          onOpenChange={setIsEditing}
          onClose={handleCancelEditing}
          defaultValues={{
            firstName: user?.first_name ?? '',
            lastName: user?.last_name ?? '',
            email: user?.email ?? '',
            phone: user?.phone ?? ''
          }}
        />
        <div className='flex items-center gap-6'>
          <div className='bg-accent/20 flex h-20 w-20 items-center justify-center rounded-full'>
            <span className='text-accent text-2xl font-semibold'>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div>
            <h3 className='text-lg font-medium'>
              {user.first_name} {user.last_name}
            </h3>
            <p className='text-muted-foreground'>{user.email}</p>
            {user.phone && <p className='text-muted-foreground'>{user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Default Addresses Section */}
      <div className='bg-card border-border rounded-2xl border p-6'>
        <h2 className='mb-4 text-xl font-semibold'>Default Addresses</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='bg-muted/50 rounded-xl p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <IconHome className='text-accent h-5 w-5' />
              <h3 className='font-medium'>Shipping Address</h3>
            </div>
            <p className='text-muted-foreground text-sm'>{formatAddress(defaultShipping)}</p>
          </div>
          <div className='bg-muted/50 rounded-xl p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <IconCreditCard className='text-accent h-5 w-5' />
              <h3 className='font-medium'>Billing Address</h3>
            </div>
            <p className='text-muted-foreground text-sm'>{formatAddress(defaultBilling)}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats using real data from summary API */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Total Orders', value: recentOrders.length, icon: IconPackage },
          { label: 'Wishlist Items', value: likedProductsCount, icon: IconHeart },
          { label: 'Saved Addresses', value: addressCount, icon: IconMapPin }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className='bg-card border-border rounded-xl border p-6 text-center'
            >
              <Icon className='text-accent mx-auto mb-3 h-8 w-8' />
              <p className='text-3xl font-bold'>{stat.value}</p>
              <p className='text-muted-foreground text-sm'>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders using real data from summary API */}
      <div className='bg-card border-border rounded-2xl border p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Recent Orders</h2>
          <Button variant='ghost' size='sm' onClick={() => setActiveTab('orders')}>
            View All
            <IconChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
        <div className='space-y-4'>
          {recentOrders.length === 0 ? (
            <div className='bg-muted/50 text-muted-foreground rounded-xl p-4 text-center'>
              No orders yet.
            </div>
          ) : (
            recentOrders.map((order: any) => (
              <div
                key={order.id}
                className='bg-muted/50 flex items-center justify-between rounded-xl p-4'
              >
                <div>
                  <p className='font-medium'>{order.order_number}</p>
                  <p className='text-muted-foreground text-sm'>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className='text-right'>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      statusColors[order.status] || ''
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className='mt-1 text-sm font-medium'>${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
