import Hero from './Hero';
import Features from './Features';
import ServiceList from './ServiceList';
import Gallery from './Gallery';
import CTA from './CTA';
import ContactSection from './ContactSection';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <ServiceList />
      <Gallery />
      <CTA />
      <ContactSection />
    </div>
  );
}
