import React, { useState } from 'react';
import MacWindow from './MacWindow';
import ApplicationsWindow from './ApplicationsWindow';
import ProjectOne from './ProjectOne';
import ProjectTwo from './ProjectTwo';
import ProjectThree from './ProjectThree';

import 'src/App.css'
import 'src/index.css'

export default function Portfolio() {
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [openWindows, setOpenWindows] = useState({});

  // Set initial position and size responsively
  React.useEffect(() => {
    const updateSizeAndPosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      let newWidth, newHeight;
      if (screenWidth < 768) {
        newWidth = Math.min(screenWidth - 40, 400);
        newHeight = Math.min(screenHeight - 120, 300);
      } else if (screenWidth < 1024) {
        newWidth = Math.min(screenWidth * 0.5, 500);
        newHeight = Math.min(screenHeight * 0.5, 350);
      } else {
        newWidth = Math.min(screenWidth * 0.4, 600);
        newHeight = Math.min(screenHeight * 0.5, 400);
      }
      
      setWindowSize({ width: newWidth, height: newHeight });
      
      setPosition(prev => ({
        x: screenWidth - newWidth - 500,
        y: Math.min(prev.y, screenHeight - newHeight - 20)
      }));
    };

    updateSizeAndPosition();
    window.addEventListener('resize', updateSizeAndPosition);
    return () => window.removeEventListener('resize', updateSizeAndPosition);
  }, []);

  const openWindow = (windowId) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowId]: true
    }));
  };

  const closeWindow = (windowId) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowId]: false
    }));
  };

  const getWindowContent = (windowId) => {
    switch (windowId) {
      case 'projectOne':
        return <ProjectOne />;
      case 'projectTwo':
        return <ProjectTwo />;
      case 'projectThree':
        return <ProjectThree />;
      default:
        return <div className="p-4">Window content</div>;
    }
  };

  const getWindowTitle = (windowId) => {
    switch (windowId) {
      case 'projectOne':
        return 'Project 1';
      case 'projectTwo':
        return 'Project 2';
      case 'projectThree':
        return 'Project 3';
      default:
        return 'Window';
    }
  };

  return (
    <div className="flex min-h-screen pt-20 gap-4">
      {/* Left content */}
      <div className="flex-1 flex justify-center pr-4">
        <div className="max-w-md text-left">
          <div className="mb-8">
            <img 
              src="src/assets/profilepic.jpg" 
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-black">Hi, I'm Ibrahim</h1>
          
          <p className="text-xl text-gray-600 mb-4">I'm a software engineer based in New York City.
         </p>
            

             {/* <p className="text-xl text-gray-600 mb-4">    I make videos on YouTube about studying, tech and just my day-to-day.</p> */}
          
          <p className="text-md text-gray-600 mb-2">I post on:</p>
          
          <div className="flex space-x-4 text-blue-600">
            <span className="underline">X ↗</span>
            <span className="underline">GitHub ↗</span>
            <span className="underline">LinkedIn ↗</span>
            <span className="underline">Blog ↗</span>
          </div>
        </div>
      </div>
      
      {/* Right content */}
      <div className="flex-1 flex justify-start pl-4">
        {/* Placeholder for right side */}
      </div>
      
      {/* Main Applications window */}
      <ApplicationsWindow
        openWindow={openWindow}
        windowSize={windowSize}
        position={position}
        setPosition={setPosition}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      {/* Render open windows */}
      {Object.entries(openWindows).map(([windowId, isOpen]) => 
        isOpen && (
          <MacWindow
            key={windowId}
            title={getWindowTitle(windowId)}
            onClose={() => closeWindow(windowId)}
            initialPosition={{ 
              x: 150 + (Object.keys(openWindows).indexOf(windowId) * 30), 
              y: 200 + (Object.keys(openWindows).indexOf(windowId) * 30) 
            }}
            showCloseButton={true}
          >
            {getWindowContent(windowId)}
          </MacWindow>
        )
      )}
    </div>
  );
}