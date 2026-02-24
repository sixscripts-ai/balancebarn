import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import NewDevPage from './components/NewDevPage';

import ContactForm from './components/ContactForm';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Load user on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-maroon/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent">
            BarnPay
          </Link>
          <div className="flex items-center gap-6">
            {location.pathname === '/' ? (
              <>
                <a href="#features" className="text-gray-300 hover:text-maroon transition-colors">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-maroon transition-colors">Pricing</a>
              </>
            ) : (
              <Link to="/" className="text-gray-300 hover:text-maroon transition-colors">Home</Link>
            )}
            <Link 
              to="/dev" 
              className={`transition-colors ${
                location.pathname === '/dev' 
                  ? 'text-maroon font-semibold' 
                  : 'text-gray-300 hover:text-maroon'
              }`}
            >
              Dev Center
            </Link>

            <button 
              onClick={handleContactClick}
              className="text-gray-300 hover:text-maroon transition-colors"
            >
              Contact
            </button>
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 rounded-lg bg-maroon-dark hover:bg-maroon transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-maroon to-maroon-light hover:shadow-lg hover:shadow-maroon/50 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              user={user} 
              onGetStarted={handleGetStarted}
              onContactClick={handleContactClick}
            />
          } 
        />
        <Route 
          path="/dev" 
          element={<NewDevPage user={user} />} 
        />

      </Routes>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </div>
  );
}

export default App;
