import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { ActiveSessionsPanel } from '../components/active-sessions-panel';
import { ChangePasswordPanel } from '../components/change-password-panel';
import { EmailVerificationPanel } from '../components/email-verification-panel';

export function AccountSetting() {
  return (
    <div className='space-y-6'>
      <h2 className='mb-4 text-xl font-semibold'>Account Settings</h2>

      <ChangePasswordPanel />
      <EmailVerificationPanel />
      <ActiveSessionsPanel />

      {/* Email Preferences */}
      <div className='bg-card border-border rounded-2xl border p-6'>
        <h3 className='mb-4 font-semibold'>Email Preferences</h3>
        <div className='space-y-4'>
          {[
            { label: 'Order updates', desc: 'Receive updates about your orders' },
            { label: 'Promotions', desc: 'Get notified about sales and promotions' },
            { label: 'New arrivals', desc: 'Be the first to know about new products' },
            { label: 'Newsletter', desc: 'Weekly style tips and inspiration' }
          ].map((pref) => (
            <div key={pref.label} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{pref.label}</p>
                <p className='text-muted-foreground text-sm'>{pref.desc}</p>
              </div>
              <Button variant='outline' size='sm'>
                Enabled
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className='rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20'>
        <h3 className='mb-4 font-semibold text-red-600'>Danger Zone</h3>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>Delete Account</p>
            <p className='text-muted-foreground text-sm'>
              Permanently delete your account and all data
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' className='border-red-300 text-red-600 hover:bg-red-100'>
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-red-600 hover:bg-red-700'>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
