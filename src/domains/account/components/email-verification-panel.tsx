'use client';

import { IconMail } from '@tabler/icons-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { sendVerificationEmailAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

export function EmailVerificationPanel() {
  const [isPending, startTransition] = useTransition();

  const handleSendVerification = () => {
    startTransition(async () => {
      const result = await sendVerificationEmailAction();
      if (result.success) {
        toast.success('Verification email sent');
        return;
      }
      toast.error(result.error ?? 'Unable to send verification email');
    });
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex gap-3'>
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
            <IconMail className='text-muted-foreground h-5 w-5' />
          </div>
          <div>
            <h3 className='font-semibold'>Email verification</h3>
            <p className='text-muted-foreground text-sm'>
              Verify your email address to secure your account and receive important updates.
            </p>
          </div>
        </div>
        <Button variant='outline' size='sm' disabled={isPending} onClick={handleSendVerification}>
          Send verification email
        </Button>
      </div>
    </div>
  );
}
