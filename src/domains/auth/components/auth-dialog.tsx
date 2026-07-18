'use client';

import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/app-dialog';
import { Flex } from '@/components/ui/flex';
import { useAuthDialogStore } from '@/stores/auth-dialog-store';

import { AuthBrandPanel } from './auth-brand-panel';
import { LoginFormPanel } from './login-form-panel';

/** Global split auth dialog — denser than the full `/login` page. */
export function AuthDialog() {
  const t = useTranslations('auth.login');
  const isOpen = useAuthDialogStore((state) => state.isOpen);
  const callbackUrl = useAuthDialogStore((state) => state.callbackUrl);
  const setOpen = useAuthDialogStore((state) => state.setOpen);
  const closeAuthDialog = useAuthDialogStore((state) => state.closeAuthDialog);

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setOpen}
      stacked
      size='xl'
      title={t('dialogTitle')}
      headerClassName='sr-only'
      className='gap-0 overflow-hidden p-0 sm:max-w-4xl'
      contentClassName='p-0 py-0'
    >
      <Flex direction='row' className='min-h-0 w-full overflow-hidden rounded-[inherit]'>
        <AuthBrandPanel compact className='min-h-[28rem] max-w-[40%] shrink-0' />
        <Flex direction='column' className='bg-background min-h-0 min-w-0 flex-1'>
          <AuthBrandPanel variant='strip' className='lg:hidden' />
          <Flex
            direction='column'
            className='max-h-[min(92dvh,40rem)] flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6'
          >
            <LoginFormPanel
              variant='dialog'
              callbackUrl={callbackUrl}
              onSuccess={closeAuthDialog}
            />
          </Flex>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
