import Link from 'next/link';

/** Terms of service body — shared by legal page and checkout dialog. */
export function TermsOfServiceContent() {
  return (
    <>
      <h2 className='text-lg font-semibold'>Agreement</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        By accessing or using Luxe Marketplace, you agree to these Terms of Service. If you do not
        agree, please do not use the site.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Accounts</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        You must provide accurate information when creating an account and keep your credentials
        secure. You are responsible for activity under your account. Purchases require a signed-in
        account.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Marketplace transactions</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        Luxe connects buyers with independent vendors. Product descriptions, pricing, shipping, and
        return policies may vary by seller. Orders are subject to vendor availability and applicable
        taxes.
      </p>

      <h2 className='mt-6 text-lg font-semibold'>Prohibited conduct</h2>
      <ul className='text-muted-foreground list-disc space-y-1 ps-5 text-sm leading-relaxed'>
        <li>Fraudulent orders or payment abuse.</li>
        <li>Scraping, reverse engineering, or interfering with platform security.</li>
        <li>Posting unlawful, misleading, or infringing content in reviews or Q&amp;A.</li>
      </ul>

      <h2 className='mt-6 text-lg font-semibold'>Limitation of liability</h2>
      <p className='text-muted-foreground text-sm leading-relaxed'>
        To the fullest extent permitted by law, Luxe is not liable for indirect or consequential
        damages arising from use of the platform. Our aggregate liability is limited to amounts paid
        for the order giving rise to the claim.
      </p>

      <p className='text-muted-foreground mt-6 text-sm leading-relaxed'>
        Questions? Email{' '}
        <Link
          href='mailto:legal@luxe.com'
          className='text-accent underline-offset-4 hover:underline'
        >
          legal@luxe.com
        </Link>
        .
      </p>
    </>
  );
}
