'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import type { LegalDocumentKind } from '../lib/legal-document';
import { LegalDocumentDialog } from './legal-document-dialog';

type LegalDocumentLinkProps = {
  kind: LegalDocumentKind;
  children: React.ReactNode;
  className?: string;
};

/** Opens legal copy from settings API in a dialog instead of navigating away. */
export function LegalDocumentLink({ kind, children, className }: LegalDocumentLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        className={cn('text-accent hover:underline', className)}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <LegalDocumentDialog kind={kind} open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
