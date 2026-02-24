import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, FileText, Zap, Shield, TrendingUp } from 'lucide-react';

const IsometricPlatform: React.FC = () => {
  const dataIcons = [
    { Icon: Database, position: { x: 20, y: 30 }, delay: 0 },
    { Icon: Brain, position: { x: 80, y: 25 }, delay: 0.5 },
    { Icon: FileText, position: { x: 15, y: 70 }, delay: 1 },
    { Icon: Zap, position: { x: 75, y: 75 }, delay: 1.5 },
    { Icon: Shield, position: { x: 50, y: 20 }, delay: 2 },
    { Icon: TrendingUp, position: { x: 60, y: 80 }, delay: 2.5 }
  ];

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-maroon-dark/10 to-black rounded-2xl overflow-hidden border-2 border-maroon/30">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(128, 0, 0, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128, 0, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            transform: 'perspective(500px) rotateX(30deg)'
          }}
        />
      </div>

      {/* Main Platform - Central Processor */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="relative w-40 h-20 bg-gradient-to-br from-maroon to-maroon-light rounded-lg border-2 border-maroon/50"
          animate={{ 
            boxShadow: [
              '0 10px 30px rgba(128, 0, 0, 0.3)',
              '0 15px 40px rgba(128, 0, 0, 0.6)',
              '0 10px 30px rgba(128, 0, 0, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            transform: 'perspective(300px) rotateX(-20deg) rotateY(10deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Platform Top Surface */}
          <div className="absolute inset-0 bg-gradient-to-br from-maroon/40 to-maroon-light/40 rounded-lg border border-maroon/30">
            {/* Circuit Pattern */}
            <div className="absolute inset-2 grid grid-cols-4 grid-rows-2 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-maroon/30 rounded-sm"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Platform Sides for 3D effect */}
          <div 
            className="absolute top-full left-0 w-full h-4 bg-gradient-to-b from-maroon-dark to-black"
            style={{ 
              transform: 'rotateX(-90deg)',
              transformOrigin: 'top'
            }}
          />
          
          {/* Central Logo/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain size={32} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Data Nodes */}
      {dataIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ 
            left: `${item.position.x}%`, 
            top: `${item.position.y}%`,
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d'
          }}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateY: [0, 360]
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: item.delay },
            scale: { duration: 0.6, delay: item.delay },
            y: { duration: 0.8, delay: item.delay },
            rotateY: { duration: 6, repeat: Infinity, delay: item.delay }
          }}
        >
          <motion.div
            className="relative bg-maroon-dark/40 backdrop-blur-sm border border-maroon/40 rounded-lg p-3"
            animate={{ 
              y: [0, -10, 0],
              rotateX: [-5, 5, -5]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: index * 0.5
            }}
            whileHover={{ 
              scale: 1.2,
              boxShadow: '0 0 25px rgba(128, 0, 0, 0.6)'
            }}
            style={{
              transform: 'perspective(200px) rotateX(-10deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            <motion.div
              className="text-maroon"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3
              }}
            >
              <item.Icon size={20} />
            </motion.div>
            
            {/* Node glow effect */}
            <motion.div
              className="absolute inset-0 bg-maroon/20 rounded-lg"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.4
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Connection Beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {dataIcons.map((item, index) => (
          <g key={index}>
            {/* Beam from node to center */}
            <motion.line
              x1={`${item.position.x}%`}
              y1={`${item.position.y}%`}
              x2="50%"
              y2="50%"
              stroke="rgba(128, 0, 0, 0.4)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1.5 + index * 0.3 }}
            />
            
            {/* Data pulse traveling along beam */}
            <motion.circle
              r="4"
              fill="rgba(128, 0, 0, 0.9)"
              filter="url(#glow)"
              initial={{ 
                cx: `${item.position.x}%`, 
                cy: `${item.position.y}%` 
              }}
              animate={{ 
                cx: [`${item.position.x}%`, '50%', `${item.position.x}%`], 
                cy: [`${item.position.y}%`, '50%', `${item.position.y}%`] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: 3 + index * 0.5,
                ease: "easeInOut"
              }}
            />
          </g>
        ))}
        
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Floating Analytics Text */}
      <motion.div
        className="absolute top-6 left-6 bg-maroon/10 backdrop-blur-sm border border-maroon/30 rounded-lg px-4 py-2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-white font-medium">NOVUS ANALYTICA</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Elevate Your Data. Transform Your Future.</div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6 bg-maroon/10 backdrop-blur-sm border border-maroon/30 rounded-lg px-4 py-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 3.5 }}
      >
        <div className="text-sm text-white">
          <span className="text-maroon font-semibold">6</span> Processing Nodes
        </div>
        <div className="text-xs text-gray-400">Active Analytics</div>
      </motion.div>

      {/* Background Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-maroon/40 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * 100 + '%'],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* Isometric Grid Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="iso-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 40 M 0 0 L 40 40" stroke="rgba(128, 0, 0, 0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-grid)" />
      </svg>
    </div>
  );
};

export default IsometricPlatform;