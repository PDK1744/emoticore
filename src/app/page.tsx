import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Hero from '@/components/landing/Hero';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
