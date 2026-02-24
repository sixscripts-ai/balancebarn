import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PricingProps {
  user: User | null;
  onAuthRequired: () => void;
}

const Pricing: React.FC<PricingProps> = ({ user, onAuthRequired }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Starter',
      planType: 'starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses getting started with data analytics',
      features: [
        'Basic analytics dashboard',
        '1 custom dashboard',
        'Email reports (weekly)',
        'Up to 10 data sources',
        'Standard support',
        '1 user account'
      ],
      popular: false
    },
    {
      name: 'Professional',
      planType: 'professional',
      price: '$79',
      period: '/month',
      description: 'Advanced analytics for growing businesses',
      features: [
        'Advanced analytics suite',
        '5 custom dashboards',
        'Daily automated reports',
        'Unlimited data sources',
        'API access',
        'Priority support',
        'Up to 10 user accounts',
        'Custom integrations'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      planType: 'enterprise',
      price: '$199',
      period: '/month',
      description: 'Complete solution for large organizations',
      features: [
        'Full analytics platform',
        'Unlimited dashboards',
        'Real-time reports',
        'Unlimited everything',
        'Advanced API access',
        'Dedicated account manager',
        'Unlimited users',
        'Custom development',
        'White-label options',
        'SLA guarantee'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planType: string, planName: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setLoadingPlan(planType);

    try {
      // Track analytics
      await supabase.functions.invoke('track-analytics', {
        body: {
          event_type: 'subscription_initiated',
          event_data: { plan: planType }
        }
      });

      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          planType,
          customerEmail: user.email
        }
      });

      if (error) throw error;

      // Check if checkout URL is returned
      if (data?.data?.checkoutUrl) {
        toast.success('Redirecting to checkout...');
        window.location.href = data.data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      
      // Check if it's because Stripe isn't initialized yet
      if (error.message?.includes('Function not found') || error.message?.includes('create-subscription')) {
        toast.error('Stripe integration is being set up. Please try again in a moment.');
      } else {
        toast.error(error.message || 'Failed to start subscription. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-black via-maroon-dark/5 to-black relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-gradient-to-br from-maroon-dark/20 to-black border-2 rounded-2xl p-8 ${
                plan.popular
                  ? 'border-maroon shadow-2xl shadow-maroon/30 scale-105'
                  : 'border-maroon/20 hover:border-maroon/50'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-maroon to-maroon-light rounded-full text-sm font-bold flex items-center gap-2">
                  <Zap size={16} />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-maroon">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-maroon mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.planType, plan.name)}
                disabled={loadingPlan !== null}
                className={`w-full py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-gradient-to-r from-maroon to-maroon-light hover:shadow-xl hover:shadow-maroon/50 transform hover:scale-105'
                    : 'bg-maroon-dark hover:bg-maroon border border-maroon/30'
                }`}
              >
                {loadingPlan === plan.planType ? 'Loading...' : 'Start Free Trial'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
