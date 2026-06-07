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
      // Push the current state back so the URL doesn't change yet
      window.history.pushState(null, '', window.location.href);
      pendingHref.current = (e.state as { url?: string } | null)?.url ?? null;
      setOpen(true);
    };

    // Push a sentinel entry so we can detect back navigation
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isDirty]);

  // ── 3. Patch router.push / router.replace ─────────────────────────────────
  // We monkey-patch the router methods once and restore on cleanup.
  useEffect(() => {
    if (!isDirty) return;

    const originalPush = router.push.bind(router);
    const originalReplace = router.replace.bind(router);

    const intercept =
      (original: typeof router.push) =>
      (...args: Parameters<typeof router.push>) => {
        if (confirmed.current) {
          confirmed.current = false;
          return original(...args);
        }
        pendingHref.current = args[0] as string;
        setOpen(true);
      };

    router.push = intercept(originalPush) as typeof router.push;
    router.replace = intercept(originalReplace) as typeof router.replace;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isDirty, router]);

  // ── Handlers ──────────────────────────────────────────────────────────────

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
