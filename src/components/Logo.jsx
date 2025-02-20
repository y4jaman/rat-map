import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="logo-container">
      <svg viewBox="0 0 300 60" className="logo">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="25%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <text 
          x="10" 
          y="80" 
          fill="url(#goldGradient)" 
          style={{ 
            fontFamily: 'Six Caps, sans-serif',
            fontSize: '108px',
            letterSpacing: '2px'
          }}
          className="logo-text">
          RATMAP
        </text>
      </svg>
    </div>
  );
}

export default Logo;