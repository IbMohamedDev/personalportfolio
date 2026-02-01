import React, { useState, useEffect } from 'react';

const ProjectOne = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [blinkingCursor, setBlinkingCursor] = useState(true);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setBlinkingCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div 
      className="h-full font-mono text-xs leading-tight overflow-hidden"
      style={{ 
        height: `calc(100% - 16px)`,
        backgroundColor: '#000814',
        color: '#00ff41',
        fontFamily: 'Courier New, monospace'
      }}
    >
      {/* Terminal Header */}
      <div className="border-b border-green-500 pb-1 mb-2 p-2">
        <div className="text-green-400">
          ╔════════════════════════════════════════════════════════════╗
        </div>
        <div className="text-green-400 text-center">
          ║                    PROJECT GENESIS                        ║
        </div>
        <div className="text-green-400">
          ╚════════════════════════════════════════════════════════════╝
        </div>
        <div className="text-green-300 text-center text-xs mt-1">
          Authorized Access Only • Grid Network Interface v2.1
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-2 space-y-1">
        <div className="text-green-500">
          {">"} SYSTEM STATUS: ACTIVE
        </div>
        <div className="text-green-500">
          {">"} USER: ibrahim_dev
        </div>
        <div className="text-green-500">
          {">"} SESSION: {currentTime}
        </div>
        <div className="text-green-500">
          {">"} CLEARANCE LEVEL: DEVELOPER
        </div>
        
        <div className="my-2 border-l-2 border-green-600 pl-2">
          <div className="text-green-400">
            [INFO] Loading project data...
          </div>
          <div className="text-green-400">
            [INFO] Establishing secure connection...
          </div>
          <div className="text-green-400">
            [SUCCESS] Connection established
          </div>
        </div>

        <div className="text-green-300 mt-3">
          ┌─ PROJECT OVERVIEW ─────────────────────────────────────┐
        </div>
        <div className="text-green-300">
          │ NAME: Full Stack E-Commerce Platform                  │
        </div>
        <div className="text-green-300">
          │ STATUS: DEPLOYED                                       │
        </div>
        <div className="text-green-300">
          │ TECH STACK: React | Node.js | PostgreSQL | Docker     │
        </div>
        <div className="text-green-300">
          │ UPTIME: 99.9%                                         │
        </div>
        <div className="text-green-300">
          └────────────────────────────────────────────────────────┘
        </div>

        <div className="text-green-400 mt-2">
          [DESCRIPTION] Advanced e-commerce platform featuring real-time 
          inventory management, secure payment processing, and AI-powered
          product recommendations. Built with modern microservices 
          architecture and containerized deployment.
        </div>

        <div className="text-green-500 mt-3">
          ┌─ FEATURES ─────────────────────────────────────────────┐
        </div>
        <div className="text-green-500">
          │ • User authentication & authorization                  │
        </div>
        <div className="text-green-500">
          │ • Real-time inventory tracking                         │
        </div>
        <div className="text-green-500">
          │ • Stripe payment integration                           │
        </div>
        <div className="text-green-500">
          │ • Admin dashboard with analytics                       │
        </div>
        <div className="text-green-500">
          │ • Responsive mobile design                             │
        </div>
        <div className="text-green-500">
          │ • Docker containerization                              │
        </div>
        <div className="text-green-500">
          └────────────────────────────────────────────────────────┘
        </div>

        <div className="text-green-600 mt-3">
          [LINKS]
        </div>
        <div className="text-green-400 hover:text-green-200 cursor-pointer underline">
          {">"} Live Demo: https://ecommerce-demo.ibrahim.dev
        </div>
        <div className="text-green-400 hover:text-green-200 cursor-pointer underline">
          {">"} GitHub Repo: https://github.com/ibrahim/ecommerce-platform
        </div>

        <div className="mt-4 text-green-500">
          {">"} <span className={blinkingCursor ? 'opacity-100' : 'opacity-0'}>█</span>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-green-900 text-green-300 text-xs p-1 flex justify-between"
        style={{ backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
      >
        <span>SECURE CONNECTION</span>
        <span>CPU: 2.1GHz | RAM: 8GB | DISK: 256GB</span>
      </div>
    </div>
  );
};

export default ProjectOne;