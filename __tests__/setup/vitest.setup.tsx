import '@testing-library/jest-dom/vitest';

import React from 'react';
import { vi } from 'vitest';

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
