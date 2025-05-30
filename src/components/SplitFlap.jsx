import React, { useState, useEffect, useRef, memo } from 'react';
import './SplitFlap.css';

// Props comparison function for memo optimization
const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.text === nextProps.text && prevProps.duration === nextProps.duration;
};

const SplitFlap = memo(({ text = '', duration = 100 }) => {
  const [displayedChars, setDisplayedChars] = useState([]);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedChars([]);
    indexRef.current = 0;

    if (!text) return;

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedChars(prev => [...prev, text[indexRef.current]]);
        indexRef.current++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, duration);

    // Cleanup on unmount or text change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, duration]);

  return (
    <div className="split-flap">
      {displayedChars.map((char, index) => (
        <span key={`${text}-${index}`} className="flap">
          {char}
        </span>
      ))}
    </div>
  );
}, arePropsEqual);

SplitFlap.displayName = 'SplitFlap';

export default SplitFlap;