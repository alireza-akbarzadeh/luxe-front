'use client';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { useGetAdminUsersIdAddresses } from '@/services/-admin-users-{id}-addresses-get';

interface CustomerAddressesCardProps {
  userId: number;
}

export function CustomerAddressesCard({ userId }: CustomerAddressesCardProps) {
  const { data, isLoading, isError } = useGetAdminUsersIdAddresses(userId);
  const addresses = data?.data?.addresses ?? [];

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <Flex
        direction='row'
        align='center'
        justify='between'
        className='bg-muted/20 border-border/10 border-b px-6 py-4'
      >
        <Text variant='overline' className='text-muted-foreground'>
          Saved addresses
        </Text>
        <Text variant='muted' className='text-[10px] font-bold uppercase tabular-nums'>
          {addresses.length}
        </Text>
      </Flex>

      <div className='divide-border/40 divide-y p-2'>
        {isLoading ? (
          <Text variant='muted' className='p-4 text-sm'>
            Loading addresses…
          </Text>
        ) : null}
        {isError ? (
          <Text variant='muted' className='p-4 text-sm'>
            Could not load addresses.
          </Text>
        ) : null}
        {!isLoading && !isError && addresses.length === 0 ? (
          <Text variant='muted' className='p-4 text-sm'>
            No saved addresses yet.
          </Text>
        ) : null}
        {addresses.map((address) => (
          <Flex key={address.id} direction='column' className='gap-1 p-4'>
            <Flex direction='row' align='center' justify='between' wrap='wrap' className='gap-2'>
              <Text className='text-sm font-semibold'>{address.recipient_name}</Text>
              <Flex direction='row' className='gap-2'>
                {address.is_default ? (
                  <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold uppercase'>
                    Default
                  </span>
                ) : null}
                {address.address_type ? (
                  <span className='text-muted-foreground text-[10px] font-bold uppercase'>
                    {address.address_type}
                  </span>
                ) : null}
              </Flex>
            </Flex>
            <Text variant='muted' className='text-sm'>
              {[address.address_line1, address.address_line2].filter(Boolean).join(', ')}
            </Text>
            <Text variant='muted' className='text-sm'>
              {[address.city, address.state, address.postal_code, address.country]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {address.phone ? (
              <Text variant='muted' className='text-xs'>
                {address.phone}
              </Text>
            ) : null}
          </Flex>
        ))}
      </div>
    </div>
  );
}
