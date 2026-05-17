'use client';

import { useState, useTransition } from 'react';
import {
  IconEdit,
  IconPackage,
  IconHeart,
  IconMapPin,
  IconChevronRight
} from '@tabler/icons-react';
import { Button } from '~/src/components/ui/button';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { mockOrders, mockWishlist, statusColors } from '../data';
import { useSidebarTab } from '../hooks/useSidebarTab';
import { useUser } from '~/src/hooks/useUser';
import { toast } from 'sonner';
import { profileFormSchema } from '../account.schema';
import { AccountProfileForm } from '../components/account-profile-form';
import { usePostProfileChangePassword } from '~/src/services/-profile-change-password-post';
import { useGetAddressesDefault } from '~/src/services/-addresses-default-get';

export function AccountOverview() {
  const { setActiveTab } = useSidebarTab();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updatPassword = usePostProfileChangePassword();
  const { data } = useGetAddressesDefault;

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    validators: {
      onChange: profileFormSchema,
      onBlur: profileFormSchema
    },
    onSubmit: async () => {
      startTransition(async () => {
        try {
          // await updateProfileAction(value);
          toast.success('Profile updated');
          setIsEditing(false);
        } catch (error) {
          toast.error('Something went wrong');
        }
      });
    }
  });

  const handleStartEditing = () => {
    // safe: user might be null, we use fallbacks
    form.reset({
      firstName: user?.first_name ?? '',
      lastName: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? ''
    });
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  // If user is still loading, show a minimal placeholder (no early return)
  if (!user) {
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
  console.log(user);

  // Normal render when user is loaded
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
            <Button variant='ghost' size='sm' onClick={handleStartEditing}>
              <IconEdit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <AccountProfileForm onCancel={handleCancelEditing} />
        ) : (
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
        )}
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Total Orders', value: mockOrders.length, icon: IconPackage },
          { label: 'Wishlist Items', value: mockWishlist.length, icon: IconHeart },
          {
            label: 'Saved Addresses',
            value: data?.addresses?.length || 0,
            icon: IconMapPin
          }
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

      {/* Recent Orders */}
      <div className='bg-card border-border rounded-2xl border p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Recent Orders</h2>
          <Button variant='ghost' size='sm' onClick={() => setActiveTab('orders')}>
            View All
            <IconChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
        <div className='space-y-4'>
          {mockOrders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className='bg-muted/50 flex items-center justify-between rounded-xl p-4'
            >
              <div>
                <p className='font-medium'>{order.id}</p>
                <p className='text-muted-foreground text-sm'>
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className='text-right'>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className='mt-1 text-sm font-medium'>${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
