import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlannedFeatureLink {
  label: string;
  href: string;
}

interface PlannedFeaturePanelProps {
  title: string;
  description: string;
  bullets: string[];
  links?: PlannedFeatureLink[];
}

/** Shared empty-state for admin routes waiting on backend APIs. */
export function PlannedFeaturePanel({
  title,
  description,
  bullets,
  links = []
}: PlannedFeaturePanelProps) {
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

        {links.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {links.map((link) => (
              <Button key={link.href} variant='outline' size='sm' asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
