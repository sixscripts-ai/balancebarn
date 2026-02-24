import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';

const FinancialDashboard: React.FC = () => {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenue(1200000);
      setExpenses(25);
      setCashFlow(500000);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const revenueData = [
    { month: 'Jan', value: 850000 },
    { month: 'Feb', value: 920000 },
    { month: 'Mar', value: 980000 },
    { month: 'Apr', value: 1050000 },
    { month: 'May', value: 1150000 },
    { month: 'Jun', value: 1200000 }
  ];

  const expenseBreakdown = [
    { category: 'Operations', percentage: 45, color: '#800000' },
    { category: 'Marketing', percentage: 25, color: '#732f2f' },
    { category: 'Development', percentage: 20, color: '#3c001c' },
    { category: 'Other', percentage: 10, color: '#500000' }
  ];

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-maroon/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128, 0, 0, 0.3) 1px, transparent 0)`
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 p-6 border-b border-maroon/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Financial Overview</h2>
            <p className="text-gray-400">Real-time financial analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
      </motion.div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
        {/* Revenue Chart */}
        <motion.div
          className="bg-maroon/5 backdrop-blur-sm border border-maroon/20 rounded-xl p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue by Source</h3>
            <TrendingUp size={20} className="text-maroon" />
          </div>
          
          {/* Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <motion.circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="rgba(128, 0, 0, 0.1)"
                strokeWidth="20"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="#800000"
                strokeWidth="20"
                strokeDasharray={`${(revenue / 1500000) * 440} 440`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                initial={{ strokeDasharray: '0 440' }}
                animate={{ strokeDasharray: `${(revenue / 1500000) * 440} 440` }}
                transition={{ duration: 2, delay: 1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-3xl font-bold text-maroon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                ${(revenue / 1000000).toFixed(1)}M
              </motion.div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          className="bg-maroon/5 backdrop-blur-sm border border-maroon/20 rounded-xl p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Expense Breakdown</h3>
            <BarChart3 size={20} className="text-maroon" />
          </div>

          <div className="space-y-4">
            {expenseBreakdown.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.category}</span>
                  <span className="text-white font-semibold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.8 + index * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="text-2xl font-bold text-maroon">{expenses}%</div>
            <div className="text-sm text-gray-400">Total Expenses</div>
          </motion.div>
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          className="bg-maroon/5 backdrop-blur-sm border border-maroon/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Recurring Revenue (MRR)</h3>
            <DollarSign size={20} className="text-maroon" />
          </div>

          <div className="h-32 flex items-end justify-between gap-2">
            {revenueData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className="bg-gradient-to-t from-maroon to-maroon-light rounded-t relative w-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / 1200000) * 100}%` }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1.5 + index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-maroon/50"
                    animate={{ 
                      boxShadow: [
                        '0 0 0px rgba(128, 0, 0, 0.5)',
                        '0 0 15px rgba(128, 0, 0, 0.8)',
                        '0 0 0px rgba(128, 0, 0, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                </motion.div>
                <div className="text-xs text-gray-400">{item.month}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cash Flow Analytics */}
        <motion.div
          className="bg-maroon/5 backdrop-blur-sm border border-maroon/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Cash Flow Analytics</h3>
            <Users size={20} className="text-maroon" />
          </div>

          {/* Cash Flow Wave */}
          <div className="relative h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 400 100">
              <motion.path
                d="M0,50 Q50,20 100,30 T200,40 T300,35 T400,30"
                stroke="#800000"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, delay: 2 }}
              />
              <motion.path
                d="M0,70 Q60,40 120,50 T240,60 T360,55 T400,50"
                stroke="rgba(128, 0, 0, 0.5)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, delay: 2.5 }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Inflow</div>
              <motion.div
                className="text-xl font-bold text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                ${(cashFlow / 1000).toFixed(0)}K
              </motion.div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Outflow</div>
              <motion.div
                className="text-xl font-bold text-red-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                $100K
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Analytics Indicators */}
      <motion.div
        className="absolute top-20 right-6 bg-maroon/10 backdrop-blur-sm border border-maroon/30 rounded-lg px-3 py-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white">Processing...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialDashboard;