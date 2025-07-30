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
  }, [isDragging, isResizing, dragStart, resizeStart, windowSize, position]);

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

// Window content components
const SystemFolderContent = () => (
  <div className="p-4 h-full" style={{ height: `calc(100% - 16px)` }}>
    <div className="mb-4">
      <h3 className="text-sm font-bold mb-2">Project 1</h3>
      <p className="text-xs text-gray-600 mb-4">Contains essential system files and resources.</p>
    </div>
    
    <div className="flex gap-4 flex-wrap">
      <div className="flex flex-col items-center" style={{ width: '64px' }}>
        <div className="w-8 h-8 border border-black bg-white mb-1 flex items-center justify-center text-xs">
          ⚙️
        </div>
        <span className="text-center leading-tight text-xs">Control Panel</span>
      </div>
      
      <div className="flex flex-col items-center" style={{ width: '64px' }}>
        <div className="w-8 h-8 border border-black bg-white mb-1 flex items-center justify-center text-xs">
          🖥️
        </div>
        <span className="text-center leading-tight text-xs">Display</span>
      </div>
      
      <div className="flex flex-col items-center" style={{ width: '64px' }}>
        <div className="w-8 h-8 border border-black bg-white mb-1 flex items-center justify-center text-xs">
          🔊
        </div>
        <span className="text-center leading-tight text-xs">Sound</span>
      </div>
    </div>
  </div>
);

const ReadMeContent = () => (
  <div className="p-4 h-full" style={{ height: `calc(100% - 16px)` }}>
    <div className="mb-4">
      <h3 className="text-sm font-bold mb-2">Read Me</h3>
    </div>
    
    <div className="text-xs leading-relaxed">
      <p className="mb-3">Welcome to Ibrahim's Portfolio System 7.0!</p>
      
      <p className="mb-3">This vintage-inspired interface showcases my work in a nostalgic Mac OS style. Navigate through the applications to explore different aspects of my portfolio.</p>
      
      <p className="mb-3">Features:</p>
      <p className="mb-1">• Draggable windows</p>
      <p className="mb-1">• Authentic System 7 styling</p>
      <p className="mb-1">• Interactive portfolio elements</p>
      
      <p className="mt-4">Enjoy exploring!</p>
    </div>
  </div>
);

const TeachTextContent = () => (
  <div className="p-4 h-full" style={{ height: `calc(100% - 16px)` }}>
    <div className="mb-4">
      <h3 className="text-sm font-bold mb-2">Project 3</h3>
    </div>
    
    <div className="text-xs leading-relaxed font-mono">
      <p className="mb-2">Document: untitled.txt</p>
      <div className="border border-gray-300 p-2 bg-gray-50 h-40 overflow-y-auto">
        <p className="mb-2">const portfolio = </p>
        <p className="mb-2">  name: "Ibrahim",</p>
        <p className="mb-2">  skills: ["React", "JavaScript", "UI/UX"],</p>
        <p className="mb-2">  passion: "building things",</p>
        <p className="mb-2">  style: "vintage meets modern"</p>
        <p className="mb-2">;</p>
        <p className="mb-2"></p>
        <p className="mb-2">// This is where creativity meets code</p>
        <p className="mb-2">console.log("Hello, World!");</p>
      </div>
    </div>
  </div>
);

export default function DraggableWindow() {
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = useState({});
  const windowRef = useRef(null);

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
      case 'system':
        return <SystemFolderContent />;
      case 'readme':
        return <ReadMeContent />;
      case 'teachtext':
        return <TeachTextContent />;
      default:
        return <div className="p-4">Window content</div>;
    }
  };

  const getWindowTitle = (windowId) => {
    switch (windowId) {
      case 'system':
        return 'Project 1';
      case 'readme':
        return 'Read Me';
      case 'teachtext':
        return 'Project 3 ';
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
          
          <p className="text-xl text-gray-600 mb-4">I like building things</p>
          
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
            {/* System Folder */}
            <div 
              className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
              style={{ width: windowSize.width > 500 ? '64px' : '48px' }}
              onClick={() => openWindow('system')}
            >
              <div className={`border border-black bg-white mb-1 flex items-center justify-center text-xs ${
                windowSize.width > 500 ? 'w-8 h-8' : 'w-6 h-6'
              }`}>
                📁
              </div>
              <span className={`text-center leading-tight ${windowSize.width > 500 ? 'text-xs' : 'text-xs'}`}>
               Project 1
              </span>
            </div>
            
            {/* Project 2*/}
            <div 
              className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
              style={{ width: windowSize.width > 500 ? '64px' : '48px' }}
              onClick={() => openWindow('readme')}
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
              onClick={() => openWindow('teachtext')}
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