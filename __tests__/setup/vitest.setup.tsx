import '@testing-library/jest-dom/vitest';

import React from 'react';
import { vi } from 'vitest';

import en from '../../messages/en.json';

function readMessage(namespace: string | undefined, key: string): string {
  if (!namespace) {
    return key;
  }

  const section = namespace.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, en);

  if (section && typeof section === 'object' && key in section) {
    return String((section as Record<string, unknown>)[key]);
  }

  return key;
}

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: (namespace?: string) => (key: string, values?: Record<string, string | number>) => {
    let message = readMessage(namespace, key);

    if (values) {
      for (const [name, value] of Object.entries(values)) {
        message = message.replaceAll(`{${name}}`, String(value));
      }
    }

    return message;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

vi.mock('next/image', () => ({
  default: ({
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ComponentProps<'img'> & { fill?: boolean; priority?: boolean }) =>
    React.createElement('img', props)
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...props }, children)
}));

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: React.ComponentProps<'span'>) =>
      React.createElement('span', props, children),
    div: ({ children, ...props }: React.ComponentProps<'div'>) =>
      React.createElement('div', props, children)
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children
}));
