import Link from 'next/link';

/** Privacy policy body — shared by legal page and checkout dialog. */
export function PrivacyPolicyContent() {
  return (
    <>
      <h2 className='text-lg font-semibold'>Overview</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Luxe Marketplace (&quot;Luxe&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy.
        This policy explains what information we collect when you use our website, how we use it,
        and the choices you have.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Information we collect</h2>
      <ul className='text-muted-foreground list-disc space-y-1 ps-5 text-sm leading-relaxed'>
        <li>Account details such as name, email address, and password hash when you register.</li>
        <li>Order, shipping, and payment information needed to fulfill purchases.</li>
        <li>Usage data such as pages viewed, device type, and approximate location from logs.</li>
        <li>Communications you send to support or through contact forms.</li>
      </ul>

      <h2 className='mt-6 text-lg font-semibold'>How we use information</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        We use your information to operate the marketplace, process orders, provide customer
        support, improve our services, prevent fraud, and — with your consent — send marketing
        communications.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Sharing</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        We share order fulfillment data with vendors and payment/shipping partners as needed to
        complete transactions. We do not sell your personal information to third parties.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Your rights</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Depending on your location, you may request access, correction, or deletion of your personal
        data. Contact{' '}
        <Link
          href='mailto:privacy@luxe.com'
          className='text-accent underline-offset-4 hover:underline'
        >
          privacy@luxe.com
        </Link>{' '}
        for privacy requests.
      </p>
    </>
  );
}
