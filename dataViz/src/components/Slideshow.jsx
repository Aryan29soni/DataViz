// slideshow.jsx
import React, { useEffect, useState } from 'react';
import './Slideshow.css';

const images = [
  '/images/d.jpeg',
  '/images/e.jpeg',
  '/images/f.jpeg',
  '/images/h.jpg',
  '/images/i.jpeg',
  '/images/j.jpg'
];

const Slideshow = ({ onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % images.length;
        onSlideChange(newIndex);
        return newIndex;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [onSlideChange]);

  return (
    <div className="slideshow">
      {images.map((image, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default Slideshow;
