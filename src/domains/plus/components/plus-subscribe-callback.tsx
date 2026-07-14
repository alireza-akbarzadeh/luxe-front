'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Legacy Stripe return URLs pointed at /plus/landing — forward to account for confirmation.
 */
export function PlusSubscribeCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const status = searchParams.get('plus');
    if (!status) return;

    handled.current = true;
    const sessionId = searchParams.get('session_id');
    const query = new URLSearchParams({ plus: status });
    if (sessionId) {
      query.set('session_id', sessionId);
    }

    router.replace(`/account?tab=plans&${query.toString()}`);
  }, [router, searchParams]);

  return null;
}
