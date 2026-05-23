import { IconMail, IconPackage, IconArrowRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'


export function TrakingFooter() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className='mb-12 grid gap-4 sm:grid-cols-2'
            >
                <div className='bg-card border-border/50 rounded-2xl border p-6'>
                    <IconMail className='text-accent mb-4 h-8 w-8' />
                    <h3 className='mb-2 font-semibold'>Check Your Email</h3>
                    <p className='text-muted-foreground text-sm'>
                        We've sent a confirmation email with your order details and tracking information.
                    </p>
                </div>
                <div className='bg-card border-border/50 rounded-2xl border p-6'>
                    <IconPackage className='text-accent mb-4 h-8 w-8' />
                    <h3 className='mb-2 font-semibold'>Track Your Order</h3>
                    <p className='text-muted-foreground text-sm'>
                        Use your order number to track your package. You'll receive updates at each step.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className='flex flex-col items-center justify-center gap-4 sm:flex-row'
            >
                <Link href='/shop'>
                    <Button variant='outline' size='lg' className='w-full rounded-full sm:w-auto'>
                        Continue Shopping
                    </Button>
                </Link>
                <Link href='/'>
                    <Button size='lg' className='w-full rounded-full sm:w-auto'>
                        Back to Home
                        <IconArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                </Link>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className='text-muted-foreground mt-12 text-center text-sm'
            >
                Questions about your order?{' '}
                <Link href='/contact' className='text-accent hover:underline'>
                    Contact our support team
                </Link>
            </motion.p>
        </>
    )
}
