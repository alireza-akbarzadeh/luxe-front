'use client';

import { useEffect } from 'react';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';

/** Keyboard shortcuts for vendor dashboard (⌘K search, ⌘B sidebar). */
export function useVendorShortcuts() {
  const setCommandOpen = useVendorPanelStore((s) => s.setCommandOpen);
  const toggleSidebarCollapsed = useVendorPanelStore((s) => s.toggleSidebarCollapsed);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;

      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (isMod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapsed();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandOpen, toggleSidebarCollapsed]);
}
