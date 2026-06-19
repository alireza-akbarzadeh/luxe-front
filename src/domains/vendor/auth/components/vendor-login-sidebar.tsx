import { motion } from 'framer-motion';

export function VendorLoginSidebar() {
  return (
    <div className='bg-gold/5 relative hidden flex-1 items-center justify-center overflow-hidden p-12 lg:flex'>
      <div className='from-gold/10 to-gold/5 absolute inset-0 bg-linear-to-br via-transparent' />
      <div className='bg-gold/10 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl' />
      <div className='bg-gold/20 absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full blur-3xl' />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className='relative z-10 max-w-md text-center'
      >
        <div className='mb-8'>
          <span className='text-6xl font-bold tracking-tight'>LUXE</span>
          <p className='text-muted-foreground mt-2 text-sm font-medium tracking-[0.2em] uppercase'>
            Vendor
          </p>
        </div>
        <h2 className='mb-4 text-2xl font-semibold'>Your seller command center</h2>
        <p className='text-muted-foreground leading-relaxed'>
          Sign in to manage products, fulfill orders, and keep your storefront polished — all from one
          vendor workspace.
        </p>
        <div className='mt-12 grid grid-cols-3 gap-6'>
          {[
            { label: 'Catalog', value: 'Products' },
            { label: 'Operations', value: 'Orders' },
            { label: 'Brand', value: 'Store' }
          ].map((feature) => (
            <div key={feature.label} className='text-center'>
              <p className='text-lg font-semibold'>{feature.value}</p>
              <p className='text-muted-foreground text-xs'>{feature.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
