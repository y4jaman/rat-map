// src/components/WorldMap.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import './WorldMap.css';

const GRAY_SHADES = [
  '#404040',
  '#4F4F4F',
  '#5E5E5E',
  '#6D6D6D',
  '#7C7C7C',
];

function WorldMap({ transform, onCountryClick, selectedCountry }) {
  const [geoData, setGeoData] = useState(null);
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const mouseDownPosRef = useRef({ x: 0, y: 0 });
  const width = 1000;
  const height = 500;

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('/data/custom.geo.json');
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    fetchGeoData();
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = false;
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (mouseDownPosRef.current) {
      const dx = Math.abs(e.clientX - mouseDownPosRef.current.x);
      const dy = Math.abs(e.clientY - mouseDownPosRef.current.y);
      // If mouse has moved more than 5 pixels, consider it a drag
      if (dx > 5 || dy > 5) {
        isDraggingRef.current = true;
      }
    }
  };

  const handleMouseUp = () => {
    mouseDownPosRef.current = null;
  };

  const paths = useMemo(() => {
    if (!geoData) return [];

    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);
    
    const pathGenerator = d3.geoPath().projection(projection);
    
    // Store the projection for use in click handler
    window.mapProjection = projection;
    
    return geoData.features.map(feature => {
      const svgPath = pathGenerator(feature.geometry);
      const bounds = pathGenerator.bounds(feature.geometry);
      
      return {
        id: feature.properties.iso_a3,
        name: feature.properties.name,
        d: svgPath,
        bounds: bounds,
        feature: feature  // Store the original feature
      };
    });
  }, [geoData]);

  const handleClick = (path, e) => {
  e.stopPropagation();
  if (isDraggingRef.current) return;


  onCountryClick({
    ...path
  });
};

  const transformStyle = {
    transform: `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.x}, ${transform.y})`
  };

  return (
    <div 
      className="world-map" 
      style={transformStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="map"
      >
        <g>
          {paths.map((path, index) => (
            <path
              key={path.id}
              d={path.d}
              className="country"
              fill={selectedCountry === path.name ? 'lightgray' : GRAY_SHADES[index % GRAY_SHADES.length]}
              stroke="lightgray"
              strokeWidth="0.3"
              data-name={path.name}
              onClick={(e) => handleClick(path, e)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default React.memo(WorldMap);