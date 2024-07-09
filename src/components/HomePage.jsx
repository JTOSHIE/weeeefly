import React, { useState, useEffect } from 'react';
import './HomePage.css';

const SplitFlap = ({ text }) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentText(prevText => prevText + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="split-flap">
      {currentText.split('').map((char, index) => (
        <span key={index} className="flap">{char}</span>
      ))}
    </div>
  );
};

import React, { useState } from 'react';

const HomePage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="homepage">
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="origin">Origin:</label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="departDate">Depart Date:</label>
            <input
              type="date"
              id="departDate"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="returnDate">Return Date:</label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Search Flights</button>
        </form>
      </main>
      <footer>
        <p>&copy; 2023 Weeeefly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;