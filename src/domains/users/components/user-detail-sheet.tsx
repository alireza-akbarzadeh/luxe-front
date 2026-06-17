'use client';

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface UserDetailSheetProps {
  user: DtoAdminUserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='border-border/40 flex items-start justify-between gap-4 border-b py-3 last:border-b-0'>
      <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {label}
      </span>
      <span className='text-right text-sm font-medium'>{value}</span>
    </div>
  );
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Unnamed user';
  const role = user?.role ?? 'user';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{fullName}</SheetTitle>
          <SheetDescription>{user?.email ?? 'No email on file'}</SheetDescription>
        </SheetHeader>

        <div className='mt-6 px-1'>
          <DetailRow label='User ID' value={user?.id ?? '—'} />
          <DetailRow
            label='Role'
            value={
              <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>{role}</Badge>
            }
          />
          <DetailRow
            label='Status'
            value={
              <span className='inline-flex items-center gap-2'>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    user?.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                  )}
                />
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            }
          />
          <DetailRow
            label='Email Verified'
            value={
              user?.email_verified_at
                ? formatDate(user.email_verified_at, DATE_FORMATS.WITH_TIME)
                : 'Not verified'
            }
          />
          <DetailRow
            label='Last Login'
            value={
              user?.last_login_at
                ? formatDate(user.last_login_at, DATE_FORMATS.WITH_TIME)
                : 'Never'
            }
          />
          <DetailRow
            label='Created'
            value={
              user?.created_at ? formatDate(user.created_at, DATE_FORMATS.WITH_TIME) : '—'
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
