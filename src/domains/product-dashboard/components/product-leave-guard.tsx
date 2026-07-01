'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface LeaveGuardProps {
  isDirty: boolean;
}

function isInternalNavigationLink(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
    return null;
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return null;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function LeaveGuard({ isDirty }: LeaveGuardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const confirmed = useRef(false);

  // ── 1. Browser unload ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // ── 2. Popstate (back / forward) ──────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: PopStateEvent) => {
      if (confirmed.current) {
        confirmed.current = false;
        return;
      }
      window.history.pushState(null, '', window.location.href);
      pendingHref.current = (e.state as { url?: string } | null)?.url ?? null;
      setOpen(true);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isDirty]);

  // ── 3. Intercept in-app link clicks (avoids mutating Next.js router) ───────
  useEffect(() => {
    if (!isDirty) return;

    const onClick = (event: MouseEvent) => {
      if (confirmed.current) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const nextPath = isInternalNavigationLink(anchor);
      if (!nextPath) return;

      event.preventDefault();
      event.stopPropagation();
      pendingHref.current = nextPath;
      setOpen(true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isDirty]);

  const handleStay = useCallback(() => {
    pendingHref.current = null;
    setOpen(false);
  }, []);

  const handleLeave = useCallback(() => {
    confirmed.current = true;
    setOpen(false);
    if (pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
    }
  }, [router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. If you leave now all progress on this product will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleStay}>Stay on page</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Leave anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
