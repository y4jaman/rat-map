import React from 'react';
import './MenuBar.css';

function MenuBar({ onAddClick, onInfoClick, onSearchClick }) {
  return (
    <div className="menu-wrapper">
      <div className="menu-bar">
        <button className="menu-button" onClick={onInfoClick}>
          <svg className="menu-icon" viewBox="0 0 199.943 199.943" fill="currentColor">
            <g>
              <g>
                <path d="M99.972,0.004C44.85,0.004,0,44.847,0,99.968c0,55.125,44.847,99.972,99.972,99.972 s99.972-44.847,99.972-99.972C199.943,44.847,155.093,0.004,99.972,0.004z M99.972,190.957c-50.168,0-90.996-40.813-90.996-90.989 c0-50.172,40.828-90.992,90.996-90.992c50.175,0,91.003,40.817,91.003,90.992S150.147,190.957,99.972,190.957z"></path> 
                <path d="M99.324,67.354c-3.708,0-6.725,3.01-6.725,6.728v75.979c0,3.722,3.017,6.739,6.725,6.739 c3.722,0,6.739-3.017,6.739-6.739V74.082C106.063,70.364,103.042,67.354,99.324,67.354z"></path> 
                <circle cx="99.746" cy="48.697" r="8.178"></circle>
              </g>
            </g>
          </svg>
          <span>Info</span>
        </button>
        <button className="menu-button" onClick={onSearchClick}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span>Search</span>
        </button>
        <button className="menu-button" onClick={onAddClick}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}

export default MenuBar;