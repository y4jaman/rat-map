import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './MessageGrid.css';

const getRandomPosition = (containerWidth, containerHeight, cardWidth, cardHeight) => {
  const padding = 20;
  const maxX = containerWidth - cardWidth - padding;
  const maxY = containerHeight - cardHeight - padding;

  return {
    x: padding + Math.random() * maxX,
    y: padding + Math.random() * maxY
  };
};

const MessageCard = ({ message, name, colorClass, onClick, initialPosition, onDragEnd }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const dragStart = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    hasDragged.current = true;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    const parent = cardRef.current.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    const maxX = parentRect.width - cardRect.width;
    const maxY = parentRect.height - cardRect.height;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (hasDragged.current) {
        const newZIndex = onDragEnd();
        setZIndex(newZIndex);
      } else {
        onClick();
      }
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!position) return null;

  const previewMessage = message.split(' ').slice(0, 3).join(' ') + '...';

  return (
    <div
      ref={cardRef}
      className={`message-card ${colorClass} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 1000 : zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="message-card-name">{name}</div>
      <div className="message-card-preview">{previewMessage}</div>
    </div>
  );
};

const MessageOverlay = ({ message, name, colorClass, onClose }) => {
  return (
    <div className="message-overlay" onClick={onClose}>
      <div 
        className={`message-overlay-content ${colorClass}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="close-note-button" onClick={onClose}>×</button>
        <div className="message-overlay-text">{message}</div>
        <div className="message-overlay-name">-{name}</div>
      </div>
    </div>
  );
};

const MessageGrid = ({ countryName }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [highestZIndex, setHighestZIndex] = useState(1);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://rat-server-2299.onrender.com/api/messages/${countryName}`);
        console.log("Fetched messages:", response.data);

        const colorClasses = ["card-blue", "card-pink", "card-purple", "card-light-purple"];

        const formattedMessages = response.data.map((msg, index) => ({
          name: msg.name || "Anonymous",
          message: msg.message || "No message provided",
          country: msg.country || countryName,
          colorClass: colorClasses[index % colorClasses.length] // Assigns colors in order
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [countryName]);

  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleCardDragEnd = () => {
    setHighestZIndex(prev => prev + 1);
    return highestZIndex + 1;
  };

  return (
    <div className="message-grid" ref={gridRef}>
      {dimensions && messages.map((msg, index) => (
        <MessageCard
          key={index}
          {...msg}
          onClick={() => setSelectedMessage(msg)}
          initialPosition={getRandomPosition(dimensions.width, dimensions.height, 60, 60)}
          onDragEnd={handleCardDragEnd}
        />
      ))}
      
      {selectedMessage && (
        <MessageOverlay
          {...selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default MessageGrid;
