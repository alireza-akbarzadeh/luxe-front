'use client';

import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/app-dialog';
import { Flex } from '@/components/ui/flex';
import { useAuthDialogStore } from '@/stores/auth-dialog-store';

import { AuthBrandPanel } from './auth-brand-panel';
import { LoginFormPanel } from './login-form-panel';

/** Global Alibaba-style split auth dialog — form shared with `/login`. */
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
      size='full'
      title={t('dialogTitle')}
      headerClassName='sr-only'
      className='gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,72rem)]'
      contentClassName='p-0 py-0'
    >
      <Flex direction='row' className='min-h-0 w-full overflow-hidden rounded-[inherit]'>
        <AuthBrandPanel className='min-h-[36rem] max-w-[44%] shrink-0' />
        <Flex direction='column' className='bg-background min-h-0 min-w-0 flex-1'>
          <AuthBrandPanel variant='strip' className='lg:hidden' />
          <Flex
            direction='column'
            className='max-h-[min(90dvh,44rem)] flex-1 overflow-y-auto px-6 py-7 sm:px-10 sm:py-10'
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
