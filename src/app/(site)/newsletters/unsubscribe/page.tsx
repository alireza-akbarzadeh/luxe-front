'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { usePostNewslettersUnsubscribe } from '@/services/-newsletters-unsubscribe-post';

type UnsubscribeStatus = 'missing-token' | 'processing' | 'success' | 'error';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const missingToken = token.length === 0;

  const [status, setStatus] = useState<UnsubscribeStatus>(
    missingToken ? 'missing-token' : 'processing'
  );

  const { mutateAsync: unsubscribe } = usePostNewslettersUnsubscribe();

  useEffect(() => {
    if (missingToken) return;

    void unsubscribe({ data: { token } })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [missingToken, token, unsubscribe]);

  const message =
    status === 'missing-token'
      ? 'Missing unsubscribe token.'
      : status === 'processing'
        ? 'Processing unsubscribe…'
        : status === 'success'
          ? 'You have been unsubscribed from marketing emails.'
          : 'Unable to process unsubscribe. The link may be invalid or expired.';

  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      className='min-h-[50vh] gap-3 px-6 text-center'
    >
      <Typography.H2>Email preferences</Typography.H2>
      <Typography.Muted>{message}</Typography.Muted>
    </Flex>
  );
}
