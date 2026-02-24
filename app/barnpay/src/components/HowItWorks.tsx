import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, FileText } from 'lucide-react';
import IsometricPlatform from './animations/IsometricPlatform';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Database size={48} />,
      number: '01',
      title: 'Connect Your Financial Data Sources',
      description: 'Seamlessly integrate with your existing accounting software, banking systems, and payment platforms. We support all major financial data sources with secure API connections.'
    },
    {
      icon: <Brain size={48} />,
      number: '02',
      title: 'AI-Powered Analysis and Insights',
      description: 'Our advanced AI engine analyzes your data in real-time, identifying patterns, trends, and anomalies. Get intelligent recommendations to optimize your financial performance.'
    },
    {
      icon: <FileText size={48} />,
      number: '03',
      title: 'Automated Reports and Recommendations',
      description: 'Receive comprehensive financial reports delivered to your inbox automatically. Access actionable insights and strategic recommendations whenever you need them.'
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-maroon/5 via-transparent to-maroon-dark/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How{' '}
            <span className="bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent">
              BarnPay Works
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get started with powerful financial analytics in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-maroon/30 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Number badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-maroon/20">
                {step.number}
              </div>

              <div className="bg-gradient-to-br from-maroon-dark/30 to-black border-2 border-maroon/30 rounded-2xl p-8 text-center hover:border-maroon hover:shadow-xl hover:shadow-maroon/20 transition-all duration-300 relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-maroon/20 text-maroon">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <IsometricPlatform />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
