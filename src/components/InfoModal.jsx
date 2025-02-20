import React from 'react';
import './InfoModal.css';

function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="info-content">
          <p>Welcome to <strong>RatMap</strong> – the interactive world map that showcases fan messages from <strong>Los Ratones</strong> supporters around the globe!</p>
          <p>See how <strong>Los Ratones</strong> unites fans worldwide by clicking on any region to explore passionate messages from fellow supporters.</p>
          <p>Want to share your love for <strong>Los Ratones</strong>? Click the <strong>+</strong> button to submit your message and be part of the movement!</p>
          <div className="disclaimer">
            This app is made possible through free and open-source geographic data and libraries. The displayed boundaries and territories are based on neutral or international atlases and do not represent the political views of the users or site owners.
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;