'use client';

import { IconArrowRight, IconPackage, IconPackageExport,IconTruck } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';

const LINKS = [
  {
    title: 'Fulfillment center',
    description: 'Pick, pack, and ship paid orders with workflow-driven queues and tracking.',
    href: '/dashboard/fulfillment',
    icon: IconPackageExport
  },
  {
    title: 'Shipping providers',
    description: 'Manage carrier names, flat rates, and active/inactive status shown at checkout.',
    href: '/dashboard/shipping-providers',
    icon: IconTruck
  },
  {
    title: 'Shipments',
    description: 'Track fulfillment, carrier assignments, and delivery workflow for orders.',
    href: '/dashboard/shipments',
    icon: IconPackage
  }
] as const;

export function ShippingSettingsDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Shipping settings</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Fulfillment configuration hub. Carrier catalog and shipment operations live in dedicated
          modules; zones and rules are planned for a later phase.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {LINKS.map((item) => (
          <Card key={item.href} className='border-border/40 bg-card/40 backdrop-blur-2xl'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <item.icon className='text-primary size-5' />
                <CardTitle className='text-lg'>{item.title}</CardTitle>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' size='sm' className='gap-2' asChild>
                <Link href={item.href}>
                  Open
                  <IconArrowRight className='size-4' />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border-dashed'>
        <CardHeader>
          <CardTitle className='text-base'>Coming later</CardTitle>
          <CardDescription>Not implemented yet — tracked in the product roadmap</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground list-disc space-y-1 pl-5 text-sm'>
          <li>Shipping zones and region-based rates</li>
          <li>Default carrier per store or order type</li>
          <li>Free-shipping thresholds tied to cart subtotal</li>
        </CardContent>
      </Card>
    </Flex>
  );
}
