'use client';

import { useNavbarProfile } from '@/components/navbar/user/useNavbarProfile';
import { cn } from '@/lib/utils';

export function UserProfileHeader() {
  const { avatarFallback, userName, userEmail, sessionDot, isLoggedIn } = useNavbarProfile();

  return (
    <div
      className={cn(
        'relative overflow-hidden p-5',
        'bg-linear-to-br from-white via-slate-50 to-indigo-50',
        'dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950',
        'border-b border-slate-200/60 dark:border-zinc-800/60'
      )}
    >
      {/* Background glow layer */}
      <div className='pointer-events-none absolute inset-0 opacity-60 dark:opacity-30'>
        <div className='absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20' />
        <div className='absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl dark:bg-cyan-500/10' />
        <div className='absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-transparent dark:from-white/5' />
      </div>

      <div className='relative flex items-center gap-4'>
        {/* Avatar */}
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-3xl',
            'bg-white/40 text-lg font-bold shadow-lg ring-1 ring-white/30 backdrop-blur-xl',
            'sm:h-16 sm:w-16 sm:text-xl',
            'dark:bg-white/10 dark:ring-white/10'
          )}
        >
          {avatarFallback}
        </div>

        {/* User info */}
        <div className='min-w-0 flex-1'>
          <h3 className='truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-white'>
            {userName}
          </h3>

          <p className='truncate text-sm text-slate-600 dark:text-zinc-400'>{userEmail}</p>

          <div className='mt-2 inline-flex items-center gap-2 rounded-full bg-white/40 px-2.5 py-1 text-xs text-slate-700 shadow-sm ring-1 ring-white/30 backdrop-blur-xl dark:bg-white/10 dark:text-zinc-300 dark:ring-white/10'>
            <div className={cn('h-2 w-2 rounded-full', sessionDot)} />
            {isLoggedIn ? 'Active session' : 'No active session'}
          </div>
        </div>
      </div>
    </div>
  );
}
