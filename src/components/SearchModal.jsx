import React, { useState, useEffect, useRef } from 'react';
import './SearchModal.css';

function SearchModal({ isOpen, onClose, onSelectCountry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [countries, setCountries] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch and process the GeoJSON data when component mounts
    const fetchCountries = async () => {
      try {
        const response = await fetch('/public/data/custom.geo.json');
        const data = await response.json();
        const countryNames = data.features
          .map(feature => feature.properties.name)
          .sort();
        setCountries(countryNames);
      } catch (error) {
        console.error('Error loading country data:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSuggestions([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = countries.filter(country =>
        country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCountry = (country) => {
    onSelectCountry({
      name: country,
      // Add any other properties needed to match click behavior
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-box-fixed">
        <div className="search-box-wrapper" onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="search-input"
          />
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((country) => (
                <button
                  key={country}
                  className="suggestion-item"
                  onClick={() => handleSelectCountry(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;