import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, Zap, TrendingUp, BarChart, Shield } from 'lucide-react';

const DataFlowVisualization: React.FC = () => {
  const dataNodes = [
    { icon: Database, label: 'Data Sources', position: { x: '10%', y: '20%' } },
    { icon: Brain, label: 'AI Processing', position: { x: '45%', y: '15%' } },
    { icon: TrendingUp, label: 'Analytics', position: { x: '80%', y: '25%' } },
    { icon: BarChart, label: 'Visualization', position: { x: '15%', y: '70%' } },
    { icon: Shield, label: 'Security', position: { x: '70%', y: '75%' } },
    { icon: Zap, label: 'Real-time', position: { x: '85%', y: '50%' } }
  ];

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-maroon-dark/10 to-black rounded-2xl overflow-hidden border-2 border-maroon/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(128, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Central Processing Unit */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-32 h-32 bg-gradient-to-br from-maroon to-maroon-light rounded-lg border-2 border-maroon/50"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(128, 0, 0, 0.3)',
              '0 0 40px rgba(128, 0, 0, 0.6)',
              '0 0 20px rgba(128, 0, 0, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* CPU Core Pattern */}
          <div className="absolute inset-4 border border-maroon-light/30 rounded">
            <div className="grid grid-cols-3 grid-rows-3 h-full gap-1 p-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-maroon/20 rounded-sm"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Central Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain size={32} className="text-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* Data Nodes */}
      {dataNodes.map((node, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ 
            left: node.position.x, 
            top: node.position.y,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
        >
          <motion.div
            className="relative bg-maroon-dark/30 backdrop-blur-sm border border-maroon/40 rounded-xl p-4 min-w-[120px]"
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 0 25px rgba(128, 0, 0, 0.5)'
            }}
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, delay: index * 0.5 }
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="text-maroon"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
              >
                <node.icon size={24} />
              </motion.div>
              <span className="text-xs text-white font-medium text-center">
                {node.label}
              </span>
            </div>
            
            {/* Scanning Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-maroon/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: 2 + index * 0.3,
                repeatDelay: 3
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Connection Lines with Data Flow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Main circuit pathways */}
        {dataNodes.map((node, index) => {
          const centerX = 50; // Central processor at 50%
          const centerY = 50;
          const nodeX = parseFloat(node.position.x);
          const nodeY = parseFloat(node.position.y);
          
          return (
            <g key={index}>
              {/* Connection line */}
              <motion.line
                x1={`${nodeX}%`}
                y1={`${nodeY}%`}
                x2={`${centerX}%`}
                y2={`${centerY}%`}
                stroke="rgba(128, 0, 0, 0.4)"
                strokeWidth="2"
                strokeDasharray="4,4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1 + index * 0.2 }}
              />
              
              {/* Data packet traveling */}
              <motion.circle
                r="3"
                fill="rgba(128, 0, 0, 0.8)"
                initial={{ 
                  cx: `${nodeX}%`, 
                  cy: `${nodeY}%` 
                }}
                animate={{ 
                  cx: [`${nodeX}%`, `${centerX}%`, `${nodeX}%`], 
                  cy: [`${nodeY}%`, `${centerY}%`, `${nodeY}%`] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: 2 + index * 0.4,
                  ease: "easeInOut"
                }}
              />
            </g>
          );
        })}
        
        {/* Additional circuit patterns */}
        <motion.path
          d="M 100 100 L 200 100 L 200 200 L 300 200 L 300 300"
          stroke="rgba(128, 0, 0, 0.2)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2,2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, delay: 3 }}
        />
      </svg>

      {/* Floating Data Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-maroon/60 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            x: [null, Math.random() * 100 + '%'],
            y: [null, Math.random() * 100 + '%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Interactive Labels */}
      <motion.div
        className="absolute top-4 left-4 bg-maroon/10 backdrop-blur-sm border border-maroon/30 rounded-lg px-4 py-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-white">Data Processing Active</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4 bg-maroon/10 backdrop-blur-sm border border-maroon/30 rounded-lg px-4 py-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <div className="text-sm text-white">
          <span className="text-maroon font-semibold">1.2TB</span> processed
        </div>
      </motion.div>
    </div>
  );
};

export default DataFlowVisualization;