// src/pages/Landing.jsx
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TrustBadges from '../components/TrustBadges';
import FeaturedProviders from '../components/FeaturedProviders';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div>
      
      <Hero />
      <HowItWorks />
      <TrustBadges />
      <FeaturedProviders />
      <Testimonials />
      <Footer />
    </div>
  );
}
