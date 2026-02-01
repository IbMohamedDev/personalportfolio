import React, { useState, useRef } from 'react';

// Reusable Mac Window Component
const MacWindow = ({ 
  title, 
  children, 
  onClose, 
  initialPosition = { x: 100, y: 150 },
  initialSize = { width: 500, height: 350 },
  showCloseButton = true 
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [windowSize, setWindowSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation(); // Prevent triggering window drag
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height
    });
  };

  const handleMouseMove = React.useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxX = window.innerWidth - windowSize.width;
      const maxY = window.innerHeight - windowSize.height;
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x: constrainedX, y: constrainedY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(300, resizeStart.width + deltaX); // Minimum width
      const newHeight = Math.max(200, resizeStart.height + deltaY); // Minimum height
      
      // Don't let window exceed screen boundaries
      const maxWidth = window.innerWidth - position.x;
      const maxHeight = window.innerHeight - position.y;
      
      setWindowSize({
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight)
      });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, windowSize, position]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

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
          {/* Close box */}
          <div 
            className="w-3 h-3 border border-black bg-white mr-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={showCloseButton ? onClose : undefined}
          >
            {showCloseButton && <div className="w-1 h-1 bg-black"></div>}
          </div>
        </div>
        
        {/* Title */}
        <div className="flex-1 text-center">
          <span className="text-xs font-bold bg-white px-2">{title}</span>
        </div>
        
        {/* Resize handle area */}
        <div className="w-4"></div>
      </div>
      
      {/* Content area */}
      <div className="bg-white h-full relative" style={{ height: `calc(100% - 20px)` }}>
        {children}
        
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
        
        {/* Size grip - now functional for resizing */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 border-l border-t border-black bg-white cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
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

export default MacWindow;