import { IconCheckbox, IconLoader2, IconMail, IconPackage, IconTruck } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
interface OrderTrackingProgressProps {
  connected: boolean;
  stepsCompleted:
    | {
        confirmed: boolean;
        processing: boolean;
        shipped: boolean;
        delivered: boolean;
      }
    | undefined;
}
export function OrderTrackingProgress(props: OrderTrackingProgressProps) {
  const { connected, stepsCompleted } = props;

  const steps = [
    {
      icon: IconCheckbox,
      title: 'Order Confirmed',
      completed: stepsCompleted?.confirmed,
      key: 'confirmed'
    },
    {
      icon: IconPackage,
      title: 'Processing',
      completed: stepsCompleted?.processing,
      key: 'processing'
    },
    { icon: IconTruck, title: 'Shipped', completed: stepsCompleted?.shipped, key: 'shipped' },
    { icon: IconMail, title: 'Delivered', completed: stepsCompleted?.delivered, key: 'delivered' }
  ];
  const progressPercent = (steps.filter((s) => s.completed).length / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className='mb-12'
    >
      <h2 className='mb-6 text-center text-lg font-semibold'>Order Progress</h2>
      <div className='relative'>
        <div className='bg-border absolute top-6 right-0 left-0 h-0.5'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeInOut' }}
            className='h-full bg-green-500'
          />
        </div>
        <div className='relative grid grid-cols-4 gap-2'>
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 200 }}
              className='flex flex-col items-center text-center'
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}
                animate={step.completed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <step.icon className='h-5 w-5' />
              </motion.div>
              <p
                className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {step.title}
              </p>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {!connected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-muted-foreground mt-4 flex items-center justify-center gap-1 text-center text-xs'
            >
              <IconLoader2 className='h-3 w-3 animate-spin' />
              Reconnecting for live updates…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
