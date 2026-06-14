import { motion } from 'framer-motion';

import { useUser } from '@/hooks/useUser';

export function AccountHeader() {
  const { user } = useUser();
  if (!user) return;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='mb-6 sm:mb-8'
    >
      <h1 className='mb-2 text-2xl font-bold sm:text-3xl'>My Account</h1>
      <p className='text-muted-foreground text-sm sm:text-base'>
        Welcome back, {user.first_name}! Manage your account and preferences.
      </p>
    </motion.div>
  );
}
