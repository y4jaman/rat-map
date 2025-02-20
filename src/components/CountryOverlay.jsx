import React, { useState, useRef } from 'react';
import './CountryOverlay.css';
import MessageGrid from './MessageGrid';

function CountryOverlay({ countryName, onClose }) {
  if (!countryName) return null;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(false);

  const handleMouseDown = () => {
    dragStartRef.current = true;
  };

  const handleMouseMove = () => {
    if (dragStartRef.current) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e) => {
    dragStartRef.current = false;

    // If dragging occurred, don't close the overlay
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    // If user clicks on the backdrop (not dragging), close the overlay
    if (e.target.className === 'overlay-backdrop') {
      onClose();
    }
  };

  return (
    <div 
      className="overlay-backdrop"
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
    >
      <div className="overlay-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="overlay-content">
          <h1 className="country-name">{countryName}</h1>
          <div className="notes-grid">
            <MessageGrid countryName={countryName} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryOverlay;
