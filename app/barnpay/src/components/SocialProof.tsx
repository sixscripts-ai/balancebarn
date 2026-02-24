import React from 'react';
import { motion } from 'framer-motion';
import { Star, Building2 } from 'lucide-react';
import FinancialDashboard from './animations/FinancialDashboard';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'CFO, TechFlow Solutions',
      content: 'BarnPay transformed how we analyze our financial data. The AI-powered insights helped us identify cost savings opportunities worth over $500K annually.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Finance Director, GrowthScale Inc',
      content: 'The automated reporting feature alone saves our team 20 hours per week. The real-time dashboards give us the visibility we need to make quick decisions.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'CEO, DataDrive Analytics',
      content: 'Outstanding platform! The integration was seamless, and the insights are incredibly accurate. BarnPay has become an essential tool for our financial planning.',
      rating: 5
    }
  ];

  const companies = [
    'TechFlow',
    'GrowthScale',
    'DataDrive',
    'FinanceHub',
    'CloudMetrics',
    'InsightPro'
  ];

  const metrics = [
    { value: '500+', label: 'Companies Trust Us' },
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '2M+', label: 'Reports Generated' },
    { value: '4.9/5', label: 'Customer Rating' }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-maroon mb-2">
                {metric.value}
              </div>
              <div className="text-gray-400">{metric.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See what our customers say about transforming their financial operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-maroon-dark/20 to-black border border-maroon/20 rounded-2xl p-8 hover:border-maroon/50 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-maroon text-maroon" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-maroon/20 flex items-center justify-center text-maroon font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-maroon/20 pt-12"
        >
          <p className="text-center text-gray-400 mb-8">
            Powering financial insights for innovative companies
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 text-gray-500 hover:text-maroon transition-colors"
              >
                <Building2 size={24} />
                <span className="font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial insights dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <FinancialDashboard />
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
