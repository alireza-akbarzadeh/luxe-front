import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';

interface VendorModuleDomainProps {
  moduleId: string;
}

export function VendorModuleDomain({ moduleId }: VendorModuleDomainProps) {
  const config = getVendorModuleConfig(moduleId);

  if (!config) {
    notFound();
  }

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config.title}
        description={config.description}
        badge='Preview'
        actions={
          <>
            {config.quickActions?.map((action) =>
              action.href ? (
                <Button key={action.label} variant='outline' size='sm' className='rounded-xl' asChild>
                  <a href={action.href}>{action.label}</a>
                </Button>
              ) : (
                <Button key={action.label} variant='outline' size='sm' className='rounded-xl'>
                  {action.label}
                </Button>
              )
            )}
          </>
        }
      />

      <div className='border-border/50 bg-gold/5 text-muted-foreground rounded-2xl border px-4 py-3 text-sm'>
        This module is wired for vendor-scoped APIs. UI structure is production-ready — connect
        backend endpoints to activate live data.
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {config.sections.map((section) => (
          <Card key={section.title} className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
            <CardHeader>
              <CardTitle className='text-lg'>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-wrap gap-2'>
                {section.features.map((feature) => (
                  <li key={feature}>
                    <Badge variant='outline' className='rounded-full font-normal'>
                      {feature}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
