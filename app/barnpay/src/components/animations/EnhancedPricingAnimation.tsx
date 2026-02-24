import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, Crown, Star } from 'lucide-react';

const EnhancedPricingAnimation: React.FC = () => {
  const pricingFeatures = [
    {
      title: 'BASIC',
      price: 29,
      popular: false,
      icon: <CreditCard size={24} />,
      features: ['Basic Analytics', 'Email Reports', '1 Dashboard', 'Standard Support'],
      color: 'from-maroon-dark/30 to-maroon/20'
    },
    {
      title: 'PRO',
      price: 99,
      popular: true,
      icon: <Zap size={24} />,
      features: ['Advanced Analytics', 'API Access', '5 Dashboards', 'Priority Support'],
      color: 'from-maroon to-maroon-light'
    },
    {
      title: 'ENTERPRISE',
      price: 'CUSTOM',
      popular: false,
      icon: <Crown size={24} />,
      features: ['Unlimited Everything', 'Custom Integration', 'Dedicated Manager', '24/7 Support'],
      color: 'from-maroon-light/30 to-maroon-dark/20'
    }
  ];

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-black via-maroon-dark/5 to-black rounded-2xl overflow-hidden border-2 border-maroon/30">
      {/* Background Geometric Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <defs>
            <pattern id="pricing-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="rgba(128, 0, 0, 0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-grid)" />
          
          {/* Animated geometric lines */}
          <motion.path
            d="M 0 300 Q 200 200 400 300 T 800 300"
            stroke="rgba(128, 0, 0, 0.2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-maroon/50 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * 100 + '%'],
            x: [null, Math.random() * 100 + '%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      <div className="relative z-10 p-8 h-full flex flex-col justify-center">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-gray-400">Pricing that scales with your business</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingFeatures.map((plan, index) => (
            <motion.div
              key={plan.title}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="bg-gradient-to-r from-maroon to-maroon-light px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star size={16} />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <motion.div
                className={`relative bg-gradient-to-br ${plan.color} backdrop-blur-sm border-2 ${
                  plan.popular 
                    ? 'border-maroon shadow-2xl shadow-maroon/30' 
                    : 'border-maroon/30 hover:border-maroon/60'
                } rounded-2xl p-8 h-full transition-all duration-300 overflow-hidden`}
                animate={plan.popular ? {
                  boxShadow: [
                    '0 0 30px rgba(128, 0, 0, 0.3)',
                    '0 0 50px rgba(128, 0, 0, 0.6)',
                    '0 0 30px rgba(128, 0, 0, 0.3)'
                  ]
                } : {}}
                transition={plan.popular ? { duration: 3, repeat: Infinity } : {}}
              >
                {/* Animated Border Glow */}
                {plan.popular && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      background: [
                        'linear-gradient(0deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.3))',
                        'linear-gradient(90deg, rgba(128, 0, 0, 0.3), rgba(128, 0, 0, 0.1))',
                        'linear-gradient(180deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.3))',
                        'linear-gradient(270deg, rgba(128, 0, 0, 0.3), rgba(128, 0, 0, 0.1))'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                )}

                {/* Plan Icon */}
                <motion.div
                  className="text-maroon mb-4"
                  animate={{ 
                    rotate: plan.popular ? [0, 5, -5, 0] : 0,
                    scale: plan.popular ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: plan.popular ? Infinity : 0
                  }}
                >
                  {plan.icon}
                </motion.div>

                {/* Plan Title */}
                <motion.h3
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {plan.title}
                </motion.h3>

                {/* Price */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {typeof plan.price === 'number' ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-maroon">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-maroon">{plan.price}</div>
                  )}
                </motion.div>

                {/* Features List */}
                <motion.div
                  className="space-y-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 + featureIndex * 0.05 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-maroon rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: featureIndex * 0.2
                        }}
                      />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-maroon to-maroon-light hover:shadow-xl hover:shadow-maroon/50'
                      : 'bg-maroon-dark hover:bg-maroon border border-maroon/30'
                  } text-white`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.price === 'CUSTOM' ? 'Contact Sales' : 'Get Started'}
                </motion.button>

                {/* Ripple Effect on Hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  variants={{
                    hover: {
                      background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(128, 0, 0, 0.1) 0%, transparent 50%)'
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Payment Icons */}
        <motion.div
          className="flex justify-center items-center gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="text-gray-400 text-sm">Accepted payments:</span>
          {['VISA', 'MC', 'AMEX', 'PayPal'].map((payment, index) => (
            <motion.div
              key={payment}
              className="bg-maroon/10 backdrop-blur-sm border border-maroon/20 rounded px-3 py-1 text-xs text-gray-300"
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3
              }}
            >
              {payment}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedPricingAnimation;