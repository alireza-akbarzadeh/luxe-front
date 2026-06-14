'use client';

import { IconDeviceDesktop, IconTrash } from '@tabler/icons-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  type AuthSessionItem,
  getAuthSessionsAction,
  revokeAuthSessionAction,
  revokeOtherSessionsAction
} from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

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
  const [sessions, setSessions] = useState<AuthSessionItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadSessions = () => {
    startTransition(async () => {
      const data = await getAuthSessionsAction();
      setSessions(data);
    });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = (sessionId: number) => {
    startTransition(async () => {
      const result = await revokeAuthSessionAction(sessionId);
      if (result.success) {
        toast.success('Session revoked');
        loadSessions();
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
        loadSessions();
        return;
      }
      toast.error('Unable to revoke other sessions');
    });
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-6'>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='font-semibold'>Active sessions</h3>
          <p className='text-muted-foreground text-sm'>
            Devices currently signed in to your account
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          disabled={isPending || sessions.length <= 1}
          onClick={handleRevokeOthers}
        >
          Sign out other devices
        </Button>
      </div>

      <div className='space-y-3'>
        {sessions.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No active sessions found.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className='border-border flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between'
            >
              <div className='flex gap-3'>
                <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-lg'>
                  <IconDeviceDesktop className='text-muted-foreground h-5 w-5' />
                </div>
                <div>
                  <p className='font-medium'>
                    {session.user_agent || 'Unknown device'}
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
                  size='icon'
                  disabled={isPending}
                  onClick={() => handleRevoke(session.id)}
                  aria-label='Revoke session'
                >
                  <IconTrash className='h-4 w-4' />
                </Button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
