import { IconShoppingBag } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ModelsOrderItem } from '~/src/services/-checkout-post.schemas'

interface OrderItemSummaryProps {
    orderItems: ModelsOrderItem[]
}

export function OrderItemSummary(props: OrderItemSummaryProps) {
    const { orderItems } = props
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className='lg:col-span-2'
        >
            <div className='bg-card border-border/50 rounded-2xl border p-6'>
                <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                    <IconShoppingBag className='h-5 w-5' />
                    Items in your order
                </h2>
                <div className='divide-y divide-border'>
                    {orderItems?.map((item) => (
                        <div key={item.id} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
                            <div className='bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg'>
                                {item.product?.images?.[0] && (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className='object-cover'
                                    />
                                )}
                            </div>
                            <div className='flex flex-1 flex-col sm:flex-row sm:justify-between'>
                                <div>
                                    <p className='font-medium'>{item.product?.name}</p>
                                    <p className='text-muted-foreground text-sm'>
                                        Qty: {item.quantity} × ${item.price}
                                    </p>
                                    {Number(item?.product?.colors?.length) > 0 && (
                                        <p className='text-muted-foreground text-xs'>Color: {item.product?.colors?.[0]}</p>
                                    )}
                                </div>
                                <p className='font-semibold mt-1 sm:mt-0'>${item.total}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
