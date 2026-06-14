'use client';

import { IconCircleCheck, IconMail } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import {
  getGetAccountSummaryQueryKey,
  useGetAccountSummary
} from '~/src/services/-account-summary-get';
import { usePostAuthSendVerification } from '~/src/services/-auth-send-verification-post';

export function EmailVerificationPanel() {
  const queryClient = useQueryClient();
  const { data: summaryResponse, isLoading } = useGetAccountSummary();
  const { mutateAsync, isPending } = usePostAuthSendVerification();

  const email = summaryResponse?.data?.email;
  const isVerified = Boolean(summaryResponse?.data?.email_verified_at);

  const handleSendVerification = async () => {
    try {
      await mutateAsync();
      toast.success('Verification email sent — check your inbox');
    } catch (error) {
      toast.error(extractErrorMessage(error as AxiosError<ApiErrorResponse>));
    }
  };

  const handleRefreshStatus = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
    toast.message('Verification status refreshed');
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex gap-3'>
          <div
            className={
              isVerified
                ? 'bg-emerald-500/10 flex size-10 shrink-0 items-center justify-center rounded-lg'
                : 'bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg'
            }
          >
            {isVerified ? (
              <IconCircleCheck className='size-5 text-emerald-600 dark:text-emerald-400' />
            ) : (
              <IconMail className='text-muted-foreground size-5' />
            )}
          </div>
          <div>
            <h3 className='font-display text-lg font-semibold tracking-tight'>
              Email verification
            </h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              {isLoading
                ? 'Checking verification status…'
                : isVerified
                  ? `${email ?? 'Your email'} is verified.`
                  : `Verify ${email ?? 'your email'} to secure your account and receive order updates.`}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {!isVerified ? (
            <Button
              variant='outline'
              size='sm'
              className='rounded-full'
              disabled={isPending || isLoading}
              onClick={() => void handleSendVerification()}
            >
              Send verification email
            </Button>
          ) : null}
          <Button
            variant='ghost'
            size='sm'
            className='rounded-full'
            disabled={isLoading}
            onClick={handleRefreshStatus}
          >
            Refresh status
          </Button>
        </div>
      </div>
    </div>
  );
}
