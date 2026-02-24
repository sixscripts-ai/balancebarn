import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedDashboard: React.FC = () => {
  const [revenue, setRevenue] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [transactions, setTransactions] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenue(1200000);
      setGrowth(18.5);
      setTransactions(45783);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 92 },
    { month: 'Jun', value: 88 }
  ];

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-maroon-dark/20 to-black rounded-2xl overflow-hidden border-2 border-maroon/30">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-maroon/20" />
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-maroon rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * 100 + '%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Main Dashboard Content */}
      <div className="relative z-10 p-8 h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold text-white mb-2">Financial Overview</h3>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live Data</span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-maroon/10 backdrop-blur-sm border border-maroon/20 rounded-lg p-4"
          >
            <div className="text-sm text-gray-400 mb-1">Total Revenue</div>
            <motion.div
              className="text-2xl font-bold text-maroon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              ${revenue.toLocaleString()}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-maroon/10 backdrop-blur-sm border border-maroon/20 rounded-lg p-4"
          >
            <div className="text-sm text-gray-400 mb-1">Growth Rate</div>
            <motion.div
              className="text-2xl font-bold text-green-400 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              +{growth.toFixed(1)}%
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-green-400"
              >
                ↗
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-maroon/10 backdrop-blur-sm border border-maroon/20 rounded-lg p-4"
          >
            <div className="text-sm text-gray-400 mb-1">Transactions</div>
            <motion.div
              className="text-2xl font-bold text-maroon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {transactions.toLocaleString()}
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-maroon/5 backdrop-blur-sm border border-maroon/20 rounded-lg p-4"
        >
          <div className="text-sm text-gray-400 mb-4">Revenue Trend (6 Months)</div>
          <div className="flex items-end justify-between h-32 gap-2">
            {chartData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className="bg-gradient-to-t from-maroon to-maroon-light rounded-t relative overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1.2 + index * 0.1,
                    ease: "easeOut"
                  }}
                  style={{ width: '100%' }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-maroon opacity-50"
                    animate={{ 
                      boxShadow: [
                        '0 0 0px rgba(128, 0, 0, 0.5)',
                        '0 0 20px rgba(128, 0, 0, 0.8)',
                        '0 0 0px rgba(128, 0, 0, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="text-xs text-gray-500">{item.month}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Flow Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <motion.path
            d="M 50 200 Q 200 100 350 180 T 600 160"
            stroke="rgba(128, 0, 0, 0.5)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
          <motion.path
            d="M 100 400 Q 300 350 500 380 T 700 360"
            stroke="rgba(128, 0, 0, 0.3)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
          />
        </svg>

        {/* Floating Holographic Elements */}
        <motion.div
          className="absolute top-16 right-8 w-16 h-16 border border-maroon/40 rounded-lg"
          animate={{ 
            y: [0, -10, 0],
            rotateY: [0, 180, 360]
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity },
            rotateY: { duration: 8, repeat: Infinity }
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-maroon/20 to-transparent rounded-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-8 w-12 h-12 border border-maroon/30 rounded-full"
          animate={{ 
            x: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            delay: 1
          }}
        >
          <div className="absolute inset-0 bg-maroon/10 rounded-full animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedDashboard;