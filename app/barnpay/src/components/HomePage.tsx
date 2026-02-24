import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import SocialProof from './SocialProof';
import FinalCTA from './FinalCTA';
import ContactForm from './ContactForm';
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface HomePageProps {
  user: User | null;
  onGetStarted: () => void;
  onContactClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onGetStarted, onContactClick }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect to dashboard or pricing
      const pricingSection = document.getElementById('pricing');
      pricingSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Show auth modal for signup
      setShowAuthModal(true);
    }
  };

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  return (
    <>
      {/* Main Content */}
      <main className="pt-20">
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <Pricing user={user} onAuthRequired={() => setShowAuthModal(true)} />
        <SocialProof />
        <FinalCTA onGetStarted={handleGetStarted} />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-maroon/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent mb-4">
                BarnPay
              </h3>
              <p className="text-gray-400 text-sm">
                Transform your financial data into actionable insights with our powerful analytics platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-maroon mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-maroon transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-maroon transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-maroon transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-maroon mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-maroon transition-colors">About Us</a></li>
                <li><button onClick={handleContactClick} className="hover:text-maroon transition-colors">Contact</button></li>
                <li><a href="#" className="hover:text-maroon transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-maroon mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-maroon transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-maroon transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-maroon/20 text-center text-sm text-gray-400">
            2025 BarnPay. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </>
  );
};

export default HomePage;