import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Shield, 
  Database, 
  FileText,
  BarChart3,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface DevPageProps {
  user: User | null;
}

const DevPage: React.FC<DevPageProps> = ({ user }) => {
  const [selectedFeature, setSelectedFeature] = useState('advanced-analytics');

  // Feature definitions
  const features = [
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics Features',
      icon: Brain,
      description: 'AI-powered insights and predictive analytics',
      status: 'active',
      progress: 75
    },
    {
      id: 'client-portal',
      title: 'Client-Facing Dashboard',
      icon: Shield,
      description: 'Secure client self-service portal',
      status: 'beta',
      progress: 85
    }
  ];

  const renderFeatureContent = () => {
    switch (selectedFeature) {
      case 'advanced-analytics':
        return (
          <div className="space-y-8">
            {/* AI Dashboard Builder */}
            <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-maroon mb-4">Custom Dashboard Builder</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Drag & Drop Components</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Revenue Chart", icon: BarChart3, type: "chart" },
                      { name: "KPI Cards", icon: TrendingUp, type: "metric" },
                      { name: "Data Table", icon: FileText, type: "table" },
                      { name: "Alert Panel", icon: Zap, type: "alert" }
                    ].map((component, index) => (
                      <motion.div
                        key={index}
                        className="bg-black/50 border border-maroon/30 rounded-lg p-3 cursor-grab"
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{ scale: 1.1 }}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      >
                        <component.icon size={16} className="text-maroon mb-2" />
                        <div className="text-sm font-medium">{component.name}</div>
                        <div className="text-xs text-gray-400">{component.type}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/50 border-2 border-dashed border-maroon/30 rounded-lg p-6 min-h-[300px]">
                  <div className="text-center text-gray-400">
                    <Database size={48} className="mx-auto mb-4 opacity-30" />
                    <div className="text-lg font-medium mb-2">Your Custom Dashboard</div>
                    <div className="text-sm">Drag components here to build your dashboard</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Brain size={20} className="text-maroon" />
                  AI-Powered Insights
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      type: "Anomaly Detection",
                      message: "Revenue spike detected: 23% above normal for November",
                      confidence: 94,
                      action: "Investigate new customer acquisition"
                    },
                    {
                      type: "Predictive Alert",
                      message: "Cash flow concern predicted for January 2025",
                      confidence: 87,
                      action: "Review Q4 payment terms"
                    },
                    {
                      type: "Optimization",
                      message: "Expense category 'Software' trending 15% over budget",
                      confidence: 92,
                      action: "Audit SaaS subscriptions"
                    }
                  ].map((insight, index) => (
                    <motion.div
                      key={index}
                      className="bg-black/50 border border-maroon/30 rounded p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-maroon">{insight.type}</span>
                        <span className="text-xs bg-maroon/20 px-2 py-1 rounded">{insight.confidence}% confidence</span>
                      </div>
                      <div className="text-sm mb-2">{insight.message}</div>
                      <div className="text-xs text-gray-400">{insight.action}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4">Predictive Analytics</h4>
                <div className="space-y-4">
                  <div className="bg-black/50 rounded p-4">
                    <div className="text-sm font-medium mb-2">Revenue Forecast - Next 6 Months</div>
                    <div className="space-y-2">
                      {[
                        { month: "Dec 2024", amount: 125000, confidence: 95 },
                        { month: "Jan 2025", amount: 118000, confidence: 87 },
                        { month: "Feb 2025", amount: 132000, confidence: 82 },
                        { month: "Mar 2025", amount: 145000, confidence: 78 },
                        { month: "Apr 2025", amount: 138000, confidence: 74 },
                        { month: "May 2025", amount: 142000, confidence: 70 }
                      ].map((forecast, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{forecast.month}</span>
                          <span className="font-medium">${forecast.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">{forecast.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'client-portal':
        return (
          <div className="space-y-8">
            {/* Client Portal Demo */}
            <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-maroon mb-4">Client Portal Interface</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Sidebar */}
                <div className="bg-black/50 rounded-lg p-4 border border-maroon/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Acme Corp</div>
                      <div className="text-sm text-gray-400">Client ID: AC-2024-001</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { label: "Dashboard", active: true },
                      { label: "Financial Reports", active: false },
                      { label: "Document Center", active: false },
                      { label: "Tasks & Deadlines", active: false },
                      { label: "Communication", active: false }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                          item.active ? 'bg-maroon text-white' : 'text-gray-400 hover:bg-maroon/20'
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-black/50 rounded-lg p-4 border border-maroon/30">
                    <h4 className="font-semibold mb-3">Financial Snapshot</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Monthly Revenue", value: "$45,280", change: "+12%" },
                        { label: "Expenses", value: "$32,150", change: "-3%" },
                        { label: "Net Profit", value: "$13,130", change: "+28%" },
                        { label: "Cash Flow", value: "$18,420", change: "+15%" }
                      ].map((metric, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-bold text-maroon">{metric.value}</div>
                          <div className="text-sm text-gray-400">{metric.label}</div>
                          <div className="text-xs text-green-400">{metric.change}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-4 border border-maroon/30">
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {[
                        { action: "Q3 Report Generated", time: "2 hours ago", status: "completed" },
                        { action: "Tax Documents Uploaded", time: "1 day ago", status: "completed" },
                        { action: "Monthly Review Scheduled", time: "3 days ago", status: "pending" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div>
                            <div className="text-sm">{activity.action}</div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            activity.status === 'completed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/50 rounded-lg p-4 border border-maroon/30">
                    <h4 className="font-semibold mb-3">Document Upload Center</h4>
                    <div className="border-2 border-dashed border-maroon/30 rounded-lg p-6 text-center">
                      <FileText size={32} className="mx-auto mb-2 text-maroon opacity-50" />
                      <div className="text-sm text-gray-400 mb-2">Drag & drop files here or click to browse</div>
                      <button className="bg-maroon hover:bg-maroon-light px-4 py-2 rounded text-sm transition-colors">
                        Select Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400">Select a feature from the sidebar to view details</div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-maroon-dark/20 border-b border-maroon/30 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-maroon to-maroon-light bg-clip-text text-transparent mb-4">
              BarnPay Development Center
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Building a Fucking Beast - Complete Feature Showcase
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-maroon">2</div>
                <div className="text-gray-400">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-maroon">80%</div>
                <div className="text-gray-400">Average Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-maroon">Active</div>
                <div className="text-gray-400">Development Status</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-4 sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-maroon">Features</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <motion.button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedFeature === feature.id 
                        ? 'bg-maroon text-white' 
                        : 'bg-black/30 hover:bg-maroon/20 text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <feature.icon size={16} />
                      <span className="font-medium text-sm">{feature.title}</span>
                    </div>
                    <div className="text-xs opacity-80 mb-2">{feature.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-700 rounded-full h-1 mr-2">
                        <div 
                          className="bg-maroon-light h-1 rounded-full"
                          style={{ width: `${feature.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{feature.progress}%</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderFeatureContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPage;