'use client';

import { useStore } from '@tanstack/react-form';

import { cn } from '@/lib/utils';

import { useFormContext } from './useFormContext';

function formatFormError(error: unknown): string | null {
  if (typeof error === 'string' && error.trim()) return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return null;
}

/** Renders form-level validation errors from the nearest `AppForm` context. */
export function ErrorMessages({ className }: { className?: string }) {
  const form = useFormContext();
  const errors = useStore(form.store, (state) => state.errors);

  const messages = errors.map(formatFormError).filter((message): message is string => Boolean(message));

  if (messages.length === 0) return null;

  return (
    <>
      {messages.map((message, index) => (
        <div key={`${message}-${index}`} className={cn('mt-1 text-xs font-bold text-red-500', className)}>
          {message}
        </div>
      ))}
    </>
  );
}
