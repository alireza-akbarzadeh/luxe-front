import { HeroSection } from '@/domains/home/components/hero-section';
import { HeroMobile } from '@/domains/home/components/ui/hero-mobile';

/**
 * Responsive hero — CSS breakpoints (md) instead of client JS so HeroSection
 * stays a Server Component (async editorial panel deferral is server-only).
 */
export function Hero() {
  return (
    <>
      <HeroMobile />
      <div className='hidden md:block'>
        <HeroSection />
      </div>
    </>
  );
}
