import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorPanelStubProps {
  title: string;
  description: string;
  bullets: string[];
}

/** Placeholder body for vendor panel sections awaiting vendor-scoped APIs. */
export function VendorPanelStub({ title, description, bullets }: VendorPanelStubProps) {
  return (
    <Card className='border-border/40 bg-card/40 max-w-3xl backdrop-blur-2xl'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <ul className='text-muted-foreground list-disc space-y-2 pl-5 text-sm'>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <Button variant='outline' size='sm' asChild>
          <Link href='/vendor'>Learn about selling on Luxe</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
