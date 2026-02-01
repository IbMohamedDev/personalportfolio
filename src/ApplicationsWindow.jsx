import React, { useState, useRef } from 'react';

const ApplicationsWindow = ({ openWindow, windowSize, position, setPosition, isDragging, setIsDragging }) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxX = window.innerWidth - windowSize.width;
    const maxY = window.innerHeight - windowSize.height;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={windowRef}
      className='bg-white fixed z-50'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        border: '2px solid #000',
        boxShadow: '2px 2px 0px #000'
      }}
    >
      {/* Title bar */}
      <div 
        className={`bg-white border-b-2 border-black flex items-center justify-between px-1 py-1 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        style={{
          background: 'repeating-linear-gradient(90deg, #000 0px, #000 1px, #fff 1px, #fff 2px)',
          height: '20px'
        }}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 border border-black bg-white mr-2 flex items-center justify-center">
            <div className="w-1 h-1 bg-black"></div>
          </div>
        </div>
        
        <div className="flex-1 text-center">
          <span className="text-xs font-bold bg-white px-2">Applications</span>
        </div>
        
        <div className="w-4"></div>
      </div>
      
      {/* Menu bar area */}
      <div className="bg-white border-b border-black px-2 py-1 text-xs">
        <div className="flex justify-between items-center">
          <span>3 items</span>
          <span>3.8 MB in disk</span>
          <span>94.5 MB available</span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="bg-white p-4 h-full relative" style={{ height: `calc(100% - 60px)` }}>
        {/* Icons */}
        <div className="flex gap-4 flex-wrap">
          {/* Project 1 */}
          <div 
            className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
            style={{ width: windowSize.width > 500 ? '64px' : '48px' }}
            onClick={() => openWindow('projectOne')}
          >
            <div className={` mb-1 flex items-center justify-center text-xs folder ${
              windowSize.width > 500 ? 'w-10 h-8' : 'w-6 h-6'
            }`}>
            </div>
            <span className={`text-center leading-tight ${windowSize.width > 500 ? 'text-xs' : 'text-xs'}`}>
             Project 1
            </span>
          </div>
          
          {/* Project 2*/}
          <div 
            className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
            style={{ width: windowSize.width > 500 ? '64px' : '48px' }}
            onClick={() => openWindow('projectTwo')}
          >
            <div className={`border border-black bg-white mb-1 flex items-center justify-center text-xs ${
              windowSize.width > 500 ? 'w-8 h-8' : 'w-6 h-6'
            }`}>
              📄
            </div>
            <span className={`text-center leading-tight ${windowSize.width > 500 ? 'text-xs' : 'text-xs'}`}>
            Project 2
            </span>
          </div>
          
          {/* Project 3 */}
          <div 
            className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
            style={{ width: windowSize.width > 500 ? '64px' : '48px' }}
            onClick={() => openWindow('projectThree')}
          >
            <div className={`border border-black bg-white mb-1 flex items-center justify-center text-xs ${
              windowSize.width > 500 ? 'w-8 h-8' : 'w-6 h-6'
            }`}>
              📝
            </div>
            <span className={`text-center leading-tight ${windowSize.width > 500 ? 'text-xs' : 'text-xs'}`}>
              Project 3 
            </span>
          </div>
        </div>
        
        {/* Scroll bars */}
        <div className="absolute right-0 top-0 w-4 h-full border-l border-black bg-white">
          <div className="w-full h-4 border-b border-black bg-gray-200"></div>
          <div className="w-full flex-1 bg-white"></div>
          <div className="w-full h-4 border-t border-black bg-gray-200"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-4 border-t border-black bg-white">
          <div className="h-full w-4 border-r border-black bg-gray-200 inline-block"></div>
          <div className="h-full flex-1 bg-white inline-block"></div>
          <div className="h-full w-4 bg-gray-200 inline-block"></div>
        </div>
        
        {/* Size grip */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-black bg-white">
          <div className="w-full h-full" style={{
            background: `repeating-linear-gradient(45deg, 
              transparent 0px, transparent 1px, 
              #000 1px, #000 2px, 
              transparent 2px, transparent 3px)`
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsWindow;