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

export async function VendorLandingDomain() {
  const user = await getServerUser();
  const isAuthenticated = Boolean(user);

  return (
    <>
      <VendorLandingNav isAuthenticated={isAuthenticated} />
      <main>
        <VendorHeroSection isAuthenticated={isAuthenticated} />
        <VendorLogoCloudSection />
        <VendorWhySellSection />
        <VendorMarketplaceBenefitsSection />
        <VendorDashboardShowcaseSection />
        <VendorHowItWorksSection />
        <VendorFeaturesSection />
        <VendorStatisticsSection />
        <VendorTestimonialsSection />
        <VendorPricingSection />
        <VendorIntegrationsSection />
        <VendorFaqSection />
        <VendorFinalCtaSection isAuthenticated={isAuthenticated} />
      </main>
      <VendorLandingFooter />
    </>
  );
}
