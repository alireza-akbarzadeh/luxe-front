'use client';

import { IconDeviceDesktop, IconLoader2, IconTrash } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

function summarizeUserAgent(userAgent?: string) {
  if (!userAgent) return 'Unknown device';

  if (/iPhone|iPad/i.test(userAgent)) return 'Apple mobile device';
  if (/Android/i.test(userAgent)) return 'Android device';
  if (/Macintosh/i.test(userAgent)) return 'Mac';
  if (/Windows/i.test(userAgent)) return 'Windows PC';
  if (/Linux/i.test(userAgent)) return 'Linux device';

  return userAgent.length > 48 ? `${userAgent.slice(0, 48)}…` : userAgent;
}

export function ActiveSessionsPanel() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: AUTH_SESSIONS_QUERY_KEY,
    queryFn: getAuthSessionsAction
  });

  const reloadSessions = () => {
    void refetch();
  };

  const handleRevoke = (sessionId: number) => {
    startTransition(async () => {
      const result = await revokeAuthSessionAction(sessionId);
      if (result.success) {
        toast.success('Session revoked');
        await queryClient.invalidateQueries({ queryKey: AUTH_SESSIONS_QUERY_KEY });
        return;
      }
      toast.error('Unable to revoke session');
    });
  };

  const handleRevokeOthers = () => {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();
      if (result.success) {
        toast.success('Signed out of other devices');
        await queryClient.invalidateQueries({ queryKey: AUTH_SESSIONS_QUERY_KEY });
        return;
      }
      toast.error('Unable to revoke other sessions');
    });
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='font-display text-lg font-semibold tracking-tight'>Active sessions</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            Devices currently signed in to your account
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='rounded-full'
          disabled={isPending || isLoading || sessions.length <= 1}
          onClick={handleRevokeOthers}
        >
          Sign out other devices
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
          <p className='text-muted-foreground text-sm'>Unable to load active sessions.</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-4 rounded-full'
            onClick={reloadSessions}
          >
            Retry
          </Button>
        </div>
      ) : sessions.length === 0 ? (
        <p className='text-muted-foreground text-sm'>No active sessions found.</p>
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
                      <span className='text-gold ml-2 text-xs font-semibold uppercase'>
                        Current
                      </span>
                    ) : null}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {session.ip_address || 'Unknown IP'}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Last active {formatSessionDate(session.last_used_at || session.created_at)}
                  </p>
                </div>
              </div>

              {!session.is_current ? (
                <Button
                  variant='ghost'
                  size='icon-sm'
                  disabled={isPending}
                  onClick={() => handleRevoke(session.id)}
                  aria-label='Revoke session'
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
