import { FaqAccordion } from '@/domains/support/components/faq-accordion';
import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

const groups = [
  {
    id: 'orders',
    title: 'Orders & Account',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse a store, add items to your bag and check out. You can pay as a guest or sign in for faster checkout, saved addresses and full order history.'
      },
      {
        q: 'Can I change or cancel an order after placing it?',
        a: 'You can edit or cancel within 30 minutes of checkout, before the vendor confirms preparation. After that, contact our concierge team — we will do our best to help.'
      },
      {
        q: 'How do I create an account?',
        a: 'Click Sign In at the top right and choose Create Account. You can also sign in with Apple, Google or email — no password required for the first time.'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: 'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, Klarna installments and select crypto. Available methods may vary by country.'
      },
      {
        q: 'Is it safe to pay on Luxe?',
        a: 'Yes. All payments are processed over a 256-bit SSL connection and we never store your full card details. We are PCI-DSS Level 1 compliant.'
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes — Klarna and Afterpay are available at checkout for eligible regions and order amounts, splitting payment into 4 interest-free installments.'
      }
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery is 3–5 business days domestically and 5–10 internationally. Express is 1–2 days domestic and 2–4 international.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to 90+ countries with duties paid at checkout so there are no surprises at the door.'
      },
      {
        q: 'Can I track my order?',
        a: 'Every order includes end-to-end tracking. You will receive a tracking link by email as soon as the vendor hands the parcel to the carrier.'
      }
    ]
  },
  {
    id: 'authenticity',
    title: 'Authenticity & Quality',
    items: [
      {
        q: 'Are all products on Luxe authentic?',
        a: 'Every brand on Luxe is vetted, contracts authenticity guarantees, and ships originals only. Designer items include certificates and serials where applicable.'
      },
      {
        q: 'What if my item arrives damaged?',
        a: 'Photograph the parcel and item within 48 hours and contact us. We will arrange free return and a replacement or refund.'
      }
    ]
  }
] as const;
export function SupportFaq() {
  return (
    <section className='pb-24'>
      <SupportPageHero
        eyebrow='FAQ'
        title='Frequently asked questions'
        description='Quick answers grouped by topic. Can’t find what you’re looking for? Our concierge is one click away.'
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Help', href: '/help' },
          { name: 'FAQ' }
        ]}
      />
      {groups.map((g, i) => (
        <SectionShell key={g.id} size='md' className={i === 0 ? 'mt-16' : 'mt-16'} id={g.id}>
          <SectionHeading eyebrow={`0${i + 1}`} title={g.title} />
          <FaqAccordion items={[...g.items]} />
        </SectionShell>
      ))}
    </section>
  );
}
