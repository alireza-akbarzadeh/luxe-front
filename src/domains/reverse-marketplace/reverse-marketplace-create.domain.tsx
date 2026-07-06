'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { createReverseMarketplaceRequest } from '@/lib/api/reverse-marketplace';

export function ReverseMarketplaceCreateDomain() {
  const t = useTranslations('reverseMarketplacePage');
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error(t('titleRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createReverseMarketplaceRequest({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        budget_min: budgetMin ? Number(budgetMin) : undefined,
        budget_max: budgetMax ? Number(budgetMax) : undefined
      });
      const id = response.data?.id;
      toast.success(t('created'));
      router.push(id ? `/reverse-marketplace/${id}` : '/reverse-marketplace');
    } catch {
      toast.error(t('createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='pb-24'>
      <div className='app-container max-w-2xl pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('breadcrumb'), href: '/reverse-marketplace' },
            { label: t('postRequest') }
          ]}
          showBackButton={false}
        />

        <Typography.H1 className='font-display mt-10 text-3xl font-bold tracking-tight'>
          {t('postRequest')}
        </Typography.H1>
        <Typography.P className='text-muted-foreground mt-3'>{t('createDescription')}</Typography.P>

        <Card className='border-border/40 mt-8 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle>{t('requestDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={(e) => void handleSubmit(e)}>
              <div className='space-y-2'>
                <Label htmlFor='title'>{t('requestTitle')}</Label>
                <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='category'>{t('category')}</Label>
                <Input id='category' value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>{t('descriptionLabel')}</Label>
                <Textarea
                  id='description'
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='budget-min'>{t('budgetMin')}</Label>
                  <Input
                    id='budget-min'
                    type='number'
                    min={0}
                    step='0.01'
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='budget-max'>{t('budgetMax')}</Label>
                  <Input
                    id='budget-max'
                    type='number'
                    min={0}
                    step='0.01'
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                <Button type='submit' className='rounded-full' disabled={isSubmitting}>
                  {t('publish')}
                </Button>
                <Button type='button' variant='outline' className='rounded-full' asChild>
                  <Link href='/reverse-marketplace'>{t('cancel')}</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
