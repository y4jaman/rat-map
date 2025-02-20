// src/components/App.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import MenuBar from './components/MenuBar';
import AddMessageModal from './components/addMessageModal';
import InfoModal from './components/InfoModal';
import SearchModal from './components/SearchModal';
import CountryOverlay from './components/CountryOverlay';
import Logo from './components/Logo';
import Notification from './components/Notification'; // Import Notification
import './App.css';

function App() {
  const [transform, setTransform] = useState({ scale: 1.2, x: 0, y: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showNotification, setShowNotification] = useState(false); // Add notification state
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef();

  const updateTransform = useCallback((newTransform) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    frameRef.current = requestAnimationFrame(() => {
      setTransform(newTransform);
    });
  }, []);

  const handleCountryClick = useCallback((countryData) => {
    setSelectedCountry(countryData.name);
  }, [updateTransform]);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    lastPositionRef.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    };
  }, [transform]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    const maxPan = 200 * Math.pow(transform.scale, 2);
    let newX = e.clientX - lastPositionRef.current.x;
    let newY = e.clientY - lastPositionRef.current.y;
    
    newX = Math.min(Math.max(newX, -maxPan), maxPan);
    newY = Math.min(Math.max(newY, -maxPan), maxPan);

    updateTransform({
      ...transform,
      x: newX,
      y: newY
    });
  }, [transform, updateTransform]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleWheel = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const mouseX = e.clientX - rect.left - containerWidth / 2;
    const mouseY = e.clientY - rect.top - containerHeight / 2;

    const pointX = (mouseX - transform.x) / transform.scale;
    const pointY = (mouseY - transform.y) / transform.scale;

    const delta = -e.deltaY * 0.005;
    const newScale = Math.min(Math.max(transform.scale + delta, 1.2), 5);

    const newX = mouseX - (pointX * newScale);
    const newY = mouseY - (pointY * newScale);

    updateTransform({
      scale: newScale,
      x: newX,
      y: newY
    });
  }, [transform, updateTransform]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <Logo />
      <div 
        ref={containerRef}
        className="map-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <WorldMap 
          transform={transform} 
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
        />
      </div>
      <MenuBar 
        onAddClick={() => setIsAddModalOpen(true)}
        onInfoClick={() => setIsInfoModalOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />
      <AddMessageModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        setShowNotification={setShowNotification} // Pass notification state
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCountry={handleCountryClick}
      />
      {selectedCountry && (
        <CountryOverlay
          countryName={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {/* Show Notification Here */}
      {showNotification && (
        <Notification message="Message posted successfully!" onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
}

export default App;
