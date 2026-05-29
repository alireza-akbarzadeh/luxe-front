'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useDashboardStore } from './admin.store';

export function useDashboardShortcuts() {
  const router = useRouter();
  const setSearchOpen = useDashboardStore((state) => state.setSearchOpen);
  const setNotificationOpen = useDashboardStore((state) => state.setNotificationOpen);
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);

  // For key sequence detection (e.g., 'g' then 'd')
  const keyBufferRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs or textareas
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;

      const key = e.key.toLowerCase();

      // Clear previous sequence buffer after 500ms of inactivity
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        keyBufferRef.current = [];
      }, 500);

      // 1) mod+K (Ctrl/Cmd+K) → open search
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        keyBufferRef.current = [];
        return;
      }

      // 2) Alt+N → open notifications
      if (e.altKey && key === 'n') {
        e.preventDefault();
        setNotificationOpen(true);
        keyBufferRef.current = [];
        return;
      }

      // 3) ESC → close all overlays
      if (key === 'escape') {
        e.preventDefault();
        setSearchOpen(false);
        setNotificationOpen(false);
        setMobileSidebarOpen(false);
        keyBufferRef.current = [];
        return;
      }

      // 4) Sequence shortcuts: 'g' then second key
      if (key === 'g') {
        // Start or continue sequence
        keyBufferRef.current = ['g'];
        return;
      }

      // If we have a sequence starting with 'g' and we get a second key
      if (keyBufferRef.current[0] === 'g' && keyBufferRef.current.length === 1) {
        e.preventDefault();
        const secondKey = key;
        switch (secondKey) {
          case 'd':
            router.push('/dashboard');
            break;
          case 'm':
            router.push('/dashboard/movies');
            break;
          case 'u':
            router.push('/dashboard/users');
            break;
          case 's':
            router.push('/dashboard/settings');
            break;
          default:
            // Unrecognised sequence – do nothing
            break;
        }
        keyBufferRef.current = [];
        return;
      }

      // Any other key resets the sequence buffer
      keyBufferRef.current = [];
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router, setSearchOpen, setNotificationOpen, setMobileSidebarOpen]);

  // No return value – the hook just sets up the event listener
}
