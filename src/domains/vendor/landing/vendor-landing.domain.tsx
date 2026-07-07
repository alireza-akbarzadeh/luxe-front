import { VendorDashboardShowcaseSection } from '@/domains/vendor/landing/components/vendor-dashboard-showcase-section';
import { VendorFaqSection } from '@/domains/vendor/landing/components/vendor-faq-section';
import { VendorFeaturesSection } from '@/domains/vendor/landing/components/vendor-features-section';
import { VendorFinalCtaSection } from '@/domains/vendor/landing/components/vendor-final-cta-section';
import { VendorHeroSection } from '@/domains/vendor/landing/components/vendor-hero-section';
import { VendorHowItWorksSection } from '@/domains/vendor/landing/components/vendor-how-it-works-section';
import { VendorIntegrationsSection } from '@/domains/vendor/landing/components/vendor-integrations-section';
import { VendorLandingFooter } from '@/domains/vendor/landing/components/vendor-landing-footer';
import { VendorLandingNav } from '@/domains/vendor/landing/components/vendor-landing-nav';
import { VendorLogoCloudSection } from '@/domains/vendor/landing/components/vendor-logo-cloud-section';
import { VendorMarketplaceBenefitsSection } from '@/domains/vendor/landing/components/vendor-marketplace-benefits-section';
import { VendorPricingSection } from '@/domains/vendor/landing/components/vendor-pricing-section';
import { VendorStatisticsSection } from '@/domains/vendor/landing/components/vendor-statistics-section';
import { VendorTestimonialsSection } from '@/domains/vendor/landing/components/vendor-testimonials-section';
import { VendorWhySellSection } from '@/domains/vendor/landing/components/vendor-why-sell-section';
import { getServerUser } from '@/lib/auth/auth-server';
import { getServerVendorStores, isVendorPanelAdmin } from '@/lib/auth/vendor-server';
import { VendorDashboardScrollSection } from '~/src/domains/vendor/landing/components/ui/vendor-dashboard-scroll-sections';

export async function VendorLandingDomain() {
  const user = await getServerUser();
  const stores = user ? await getServerVendorStores() : [];
  const hasVendorStore = stores.length > 0 || (user ? isVendorPanelAdmin(user) : false);

  return (
    <>
      <VendorLandingNav hasVendorStore={hasVendorStore} />
      <main>
        <VendorHeroSection hasVendorStore={hasVendorStore} />
        <VendorDashboardScrollSection />
        <VendorLogoCloudSection />
        <VendorWhySellSection />
        <VendorMarketplaceBenefitsSection />
        <VendorDashboardShowcaseSection />
        <VendorHowItWorksSection />
        <VendorFeaturesSection hasVendorStore={hasVendorStore} />
        <VendorStatisticsSection />
        <VendorTestimonialsSection />
        <VendorPricingSection hasVendorStore={hasVendorStore} />
        <VendorIntegrationsSection />
        <VendorFaqSection />
        <VendorFinalCtaSection hasVendorStore={hasVendorStore} />
      </main>
      <VendorLandingFooter hasVendorStore={hasVendorStore} />
    </>
  );
}
