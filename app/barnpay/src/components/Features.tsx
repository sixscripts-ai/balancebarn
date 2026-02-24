import React from 'react';
import { motion } from 'framer-motion';
import { Database, TrendingUp, Zap, BarChart, Shield, Clock } from 'lucide-react';
import DataFlowVisualization from './animations/DataFlowVisualization';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Database size={32} />,
      title: 'Real-Time Financial Data Analytics',
      description: 'Track revenue, expenses, and cash flow in real-time with live data synchronization across all your financial sources.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Automated Reporting & Insights',
      description: 'Generate comprehensive financial reports automatically. Get AI-powered recommendations to optimize your business performance.'
    },
    {
      icon: <BarChart size={32} />,
      title: 'Interactive Dashboard with Charts',
      description: 'Visualize complex financial data with beautiful, customizable charts and graphs. Drill down into any metric instantly.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Business Intelligence Tools',
      description: 'Advanced analytics engine that identifies trends, anomalies, and opportunities in your financial data automatically.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption and security protocols ensure your sensitive financial data is always protected.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Historical Analysis',
      description: 'Access years of historical data to identify patterns, forecast trends, and make informed strategic decisions.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black via-maroon-dark/5 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent">
              Data-Driven Decisions
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform raw financial data into actionable business intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-gradient-to-br from-maroon-dark/20 to-black border border-maroon/20 rounded-2xl p-8 hover:border-maroon hover:shadow-xl hover:shadow-maroon/20 transition-all duration-300"
            >
              <div className="mb-4 text-maroon group-hover:text-maroon-light transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Data visualization animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 relative"
        >
          <DataFlowVisualization />
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
