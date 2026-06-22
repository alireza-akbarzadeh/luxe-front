'use client';

import { IconDeviceDesktop, IconLoader2, IconTrash } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from 'sonner';

import {
  getAuthSessionsAction,
  revokeAuthSessionAction,
  revokeOtherSessionsAction
} from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const AUTH_SESSIONS_QUERY_KEY = ['auth', 'sessions'] as const;

function formatSessionDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ActiveSessionsPanel() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('account.sessions');
  const tCommon = useTranslations('account.common');

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: AUTH_SESSIONS_QUERY_KEY,
    queryFn: getAuthSessionsAction
  });

  const summarizeUserAgent = (userAgent?: string) => {
    if (!userAgent) return t('unknownDevice');
    if (/iPhone|iPad/i.test(userAgent)) return t('appleMobile');
    if (/Android/i.test(userAgent)) return t('androidDevice');
    if (/Macintosh/i.test(userAgent)) return t('mac');
    if (/Windows/i.test(userAgent)) return t('windowsPc');
    if (/Linux/i.test(userAgent)) return t('linuxDevice');
    return userAgent.length > 48 ? `${userAgent.slice(0, 48)}…` : userAgent;
  };

  const reloadSessions = () => {
    void refetch();
  };

  const handleRevoke = (sessionId: number) => {
    startTransition(async () => {
      const result = await revokeAuthSessionAction(sessionId);
      if (result.success) {
        toast.success(t('revoked'));
        await queryClient.invalidateQueries({ queryKey: AUTH_SESSIONS_QUERY_KEY });
        return;
      }
      toast.error(t('revokeFailed'));
    });
  };

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();
      if (result.success) {
        toast.success(t('othersRevoked'));
        await queryClient.invalidateQueries({ queryKey: AUTH_SESSIONS_QUERY_KEY });
        return;
      }
      toast.error(t('revokeOthersFailed'));
    });
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='font-display text-lg font-semibold tracking-tight'>{t('title')}</h3>
          <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='rounded-full'
          disabled={isPending || isLoading || sessions.length <= 1}
          onClick={handleRevokeOthers}
        >
          {t('signOutOthers')}
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className='h-24 w-full rounded-xl' />
          ))}
        </div>
      ) : isError ? (
        <div className='bg-muted/40 rounded-xl p-5 text-center'>
          <p className='text-muted-foreground text-sm'>{t('loadError')}</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-4 rounded-full'
            onClick={reloadSessions}
          >
            {tCommon('retry')}
          </Button>
        </div>
      ) : sessions.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{t('empty')}</p>
      ) : (
        <div className='space-y-3'>
          {sessions.map((session) => (
            <div
              key={session.id}
              className='border-border flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between'
            >
              <div className='flex gap-3'>
                <div className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg'>
                  <IconDeviceDesktop className='text-muted-foreground size-5' />
                </div>
                <div>
                  <p className='font-medium'>
                    {summarizeUserAgent(session.user_agent)}
                    {session.is_current ? (
                      <span className='text-gold ms-2 text-xs font-semibold uppercase'>
                        {t('current')}
                      </span>
                    ) : null}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {session.ip_address || t('unknownIp')}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {t('lastActive', {
                      date: formatSessionDate(session.last_used_at || session.created_at)
                    })}
                  </p>
                </div>
              </div>

              {!session.is_current ? (
                <Button
                  variant='ghost'
                  size='icon-sm'
                  disabled={isPending}
                  onClick={() => handleRevoke(session.id)}
                  aria-label={t('revokeAria')}
                >
                  {isPending ? (
                    <IconLoader2 className='size-4 animate-spin' />
                  ) : (
                    <IconTrash className='size-4' />
                  )}
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
