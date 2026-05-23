import { IconCreditCard } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { OrderStatus } from '~/src/lib/constants/enum-statuses'
import type { ModelsPayment } from '~/src/services/-checkout-post.schemas'

interface PaymentDetialsProps {
    payment: ModelsPayment
    currentStatus: string
}
export function PaymentDetails(props: PaymentDetialsProps) {
    const { payment, currentStatus } = props

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
        >
            <div className='mb-3 flex items-center gap-2'>
                <IconCreditCard className='text-accent h-5 w-5' />
                <h3 className='font-semibold'>Payment Information</h3>
            </div>
            {payment ? (
                <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Method:</span>
                        <span className='capitalize font-medium'>{payment.method?.replace('_', ' ')}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Status:</span>
                        <motion.span
                            className={`capitalize font-medium ${payment.status === 'succeeded' ? 'text-green-600' :
                                payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                                }`}
                            animate={payment.status === 'pending' && currentStatus !== OrderStatus.Pending ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {payment.status}
                        </motion.span>
                    </div>
                    {payment.transaction_id && payment.transaction_id !== 'pending' && (
                        <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Transaction ID:</span>
                            <span className='font-mono text-xs'>{payment.transaction_id}</span>
                        </div>
                    )}
                    <div className='flex justify-between border-t border-border pt-2 mt-1'>
                        <span className='text-muted-foreground'>Amount paid:</span>
                        <span className='font-bold'>${payment.amount} {payment.currency}</span>
                    </div>
                </div>
            ) : (
                <p className='text-muted-foreground text-sm'>Payment details will appear after confirmation.</p>
            )}
        </motion.div>
    )
}
