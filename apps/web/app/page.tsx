import Hero from '@/components/landing/Hero';
import FeaturesSection from '@/components/landing/Features/FeaturesSection';
import Stats from '@/components/landing/Stats';
import Benefits from '@/components/landing/Benefits';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import Integrations from '@/components/landing/Integrations';
import Security from '@/components/landing/Security';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <Stats />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <Integrations />
      <Security />
      <FAQ />
      <Footer />
    </div>
  );
}
