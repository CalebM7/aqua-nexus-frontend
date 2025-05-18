import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TrustBadges from '../components/TrustBadges';
import FeaturedProviders from '../components/FeaturedProviders';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Landing() {
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    console.log('Landing.jsx rendered', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  return (
    <div>
      {isAuthenticated && user?.role === 'provider' && (
        <div className="container mx-auto px-6 py-3 text-center">
          <Link to="/dashboard" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            Back to Dashboard
          </Link>
        </div>
      )}
      <Hero />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <TrustBadges />
      <FeaturedProviders />
      <section id="testimonials">
        <Testimonials />
      </section>
      <Footer />
    </div>
  );
}