import { IconReceipt } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface OrderTrackingSummaryProps {
    subtotal: number
    shippingCost: number
    tax: number
    total: number
    currency: string
}

export function OrderTrackingSummary(props: OrderTrackingSummaryProps) {
    const { currency, shippingCost, subtotal, tax, total } = props
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
        >
            <div className='bg-card border-border/50 rounded-2xl border p-6'>
                <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                    <IconReceipt className='h-5 w-5' />
                    Order Summary
                </h2>
                <div className='space-y-3 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Shipping</span>
                        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Tax (estimated)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className='border-t border-border pt-3 mt-3'>
                        <div className='flex justify-between font-bold'>
                            <span>Total</span>
                            <span>${total?.toFixed(2)}</span>
                        </div>
                        <p className='text-muted-foreground mt-1 text-right text-xs'>{currency}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
