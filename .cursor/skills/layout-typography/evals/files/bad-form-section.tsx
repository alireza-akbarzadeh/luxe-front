/** Intentionally bad layout — used by layout-typography eval id 1. */
export function BadFormSection() {
  return (
    <div className='flex flex-col gap-6'>
      <h3 className='text-foreground text-sm font-medium'>Basic information</h3>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>{/* name field placeholder */}</div>
        <div>{/* slug field placeholder */}</div>
      </div>
      <p className='text-muted-foreground text-sm'>Optional helper copy for this section.</p>
    </div>
  );
}
