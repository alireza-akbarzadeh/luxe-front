import '@testing-library/jest-dom/vitest';

import React from 'react';
import { vi } from 'vitest';

import en from '../../messages/en.json';

function readMessage(namespace: string | undefined, key: string): string {
  if (!namespace) {
    return key;
  }

  const parts = [...namespace.split('.'), ...key.split('.')];
  let current: unknown = en;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  return typeof current === 'string' ? current : key;
}

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations:
    (namespace?: string) => (key: string, values?: Record<string, string | number>) => {
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
