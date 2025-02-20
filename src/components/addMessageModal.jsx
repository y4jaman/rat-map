import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './addMessageModal.css';

function AddMessageModal({ isOpen, onClose, setShowNotification }) { // Accept setShowNotification as a prop
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const countryInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/src/data/custom.geo.json');
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

  const filteredCountries = countries.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountrySearch(selectedCountry);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset all form fields when modal closes
      setMessage('');
      setName('');
      setCountry('');
      setCountrySearch('');
      setShowDropdown(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.post('https://rat-server-2299.onrender.com/api/messages', {
        name,
        country,
        message
      });

      console.log('Message posted successfully');
      setShowNotification(true); // Trigger notification
      setTimeout(() => setShowNotification(false), 3000); // Auto-hide after 3 sec
      onClose(); // Close modal after posting
    } catch (error) {
      console.error('Error posting message:', error);
      setError('Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            autoComplete="off"
          />
          <div className="country-combobox">
            <input
              ref={countryInputRef}
              type="text"
              value={countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search countries..."
              required
              autoComplete="off"
            />
            {showDropdown && filteredCountries.length > 0 && (
              <div className="country-dropdown">
                {filteredCountries.map((countryName) => (
                  <button
                    key={countryName}
                    type="button"
                    className="country-option"
                    onClick={() => handleCountrySelect(countryName)}
                  >
                    {countryName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="message-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 128))}
              placeholder="Message"
              maxLength={128}
              required
            />
            <div className="char-count">
              {message.length}/128
            </div>
          </div>
          <button type="submit" className="post-button" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddMessageModal;
