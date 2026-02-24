import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, LineChart, BarChart3 } from 'lucide-react';
import AnimatedDashboard from './animations/AnimatedDashboard';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/10 via-black to-black" />
      
      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-10 text-maroon/30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <TrendingUp size={64} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-20 text-maroon-light/30"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <BarChart3 size={80} />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-maroon via-maroon-light to-maroon bg-clip-text text-transparent">
                Financial Data
              </span>{' '}
              into Actionable Insights
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              BarnPay delivers real-time analytics, automated reporting, and AI-powered insights 
              to help your business make data-driven decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-maroon to-maroon-light hover:shadow-2xl hover:shadow-maroon/50 transition-all text-lg font-semibold transform hover:scale-105"
              >
                Start Free Trial
              </button>
              <a
                href="#pricing"
                className="px-8 py-4 rounded-lg border-2 border-maroon hover:bg-maroon/10 transition-all text-lg font-semibold text-center"
              >
                View Pricing
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-maroon">500+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-maroon">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-maroon">2M+</div>
                <div className="text-sm text-gray-400">Reports</div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <AnimatedDashboard />
            
            {/* Floating chart icon */}
            <motion.div
              className="absolute -bottom-8 -left-8 bg-maroon/20 backdrop-blur-lg border border-maroon/30 rounded-2xl p-6"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <LineChart size={48} className="text-maroon" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
