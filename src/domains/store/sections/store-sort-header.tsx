'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  IconBell,
  IconCalendar,
  IconCheckbox,
  IconHeart,
  IconMapPin,
  IconPackage,
  IconRotateClockwise,
  IconShare2,
  IconStar,
  IconTruck,
  IconUsers
} from '@tabler/icons-react';
import { useStoreStore } from '../hooks/useStoreStore';

interface StoreHeaderProps {
  store: any;
  totalProducts: number;
}

export function StoreHeader({ store, totalProducts }: StoreHeaderProps) {
  const { followStore, unfollowStore, isFollowing } = useStoreStore();

  return (
    <section className='relative pt-20'>
      <div className='relative h-48 overflow-hidden md:h-64'>
        <Image src={store.banner} alt={store.name} fill className='object-cover' priority />
        <div className='from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent' />
      </div>

      <div className='relative mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='border-background relative h-24 w-24 overflow-hidden rounded-2xl border-4 shadow-lg md:h-32 md:w-32'
          >
            <Image src={store.logo} alt={store.name} fill className='object-cover' />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex-1'
          >
            <div className='mb-1 flex items-center gap-2'>
              <h1 className='text-2xl font-bold md:text-3xl'>{store.name}</h1>
              {store.isVerified && <IconCheckbox className='h-6 w-6 text-blue-500' />}
            </div>
            <p className='text-muted-foreground max-w-2xl'>{store.description}</p>

            <div className='mt-3 flex flex-wrap items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <IconStar className='fill-accent text-accent h-4 w-4' />
                <span className='font-medium'>{store.rating}</span>
                <span className='text-muted-foreground'>({store.reviewCount} reviews)</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconPackage className='h-4 w-4' />
                <span>{totalProducts} products</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconUsers className='h-4 w-4' />
                <span>{(store.followerCount / 1000).toFixed(1)}k followers</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconMapPin className='h-4 w-4' />
                <span>{store.location}</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconCalendar className='h-4 w-4' />
                <span>Since {new Date(store.joinedDate).getFullYear()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='mt-4 flex items-center gap-2 md:mt-0'
          >
            <Button
              variant={isFollowing(store.id) ? 'secondary' : 'default'}
              onClick={() =>
                isFollowing(store.id) ? unfollowStore(store.id) : followStore(store.id)
              }
              className='gap-2'
            >
              {isFollowing(store.id) ? (
                <>
                  <IconBell className='h-4 w-4' />
                  Following
                </>
              ) : (
                <>
                  <IconHeart className='h-4 w-4' />
                  Follow
                </>
              )}
            </Button>
            <Button variant='outline' size='icon'>
              <IconShare2 className='h-4 w-4' />
            </Button>
          </motion.div>
        </div>

        <div className='border-border mt-6 flex flex-wrap gap-4 border-b pb-6'>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <IconTruck className='h-4 w-4' />
            <span>{store.shippingInfo}</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <IconRotateClockwise className='h-4 w-4' />
            <span>{store.returnPolicy}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
