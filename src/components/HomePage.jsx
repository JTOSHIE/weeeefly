import React, { useState, useCallback, memo, useRef } from 'react';
import SplitFlap from './SplitFlap';
import { useFlightForm } from '../hooks/useFlightForm';
import './HomePage.css';

const HomePage = memo(() => {
  const formRef = useRef(null);
  const [searchResults, setSearchResults] = useState(null);
  
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: submitForm
  } = useFlightForm();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    await submitForm(async (formValues) => {
      console.log('Searching flights:', formValues);
      // TODO: Implement actual API call
      // const results = await searchFlights(formValues);
      // setSearchResults(results);
    });
  }, [submitForm]);

  return (
    <div className="homepage">
      <header>
        <h1 className="logo">Weeeefly</h1>
        <SplitFlap text="Find Your Perfect Flight" duration={80} />
      </header>
      <main role="main" aria-label="Flight search">
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          aria-label="Flight search form"
          noValidate
        >
          <div className="form-group">
            <label htmlFor="origin">Origin:</label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={values.origin}
              onChange={handleChange('origin')}
              aria-label="Origin airport or city"
              aria-required="true"
              aria-invalid={!!errors.origin}
              aria-describedby={errors.origin ? 'origin-error' : undefined}
              required
            />
            {errors.origin && (
              <span id="origin-error" className="error-message" role="alert">
                {errors.origin}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={values.destination}
              onChange={handleChange('destination')}
              aria-label="Destination airport or city"
              aria-required="true"
              aria-invalid={!!errors.destination}
              aria-describedby={errors.destination ? 'destination-error' : undefined}
              required
            />
            {errors.destination && (
              <span id="destination-error" className="error-message" role="alert">
                {errors.destination}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="departDate">Depart Date:</label>
            <input
              type="date"
              id="departDate"
              name="departDate"
              value={values.departDate}
              onChange={handleChange('departDate')}
              aria-label="Departure date"
              aria-required="true"
              aria-invalid={!!errors.departDate}
              aria-describedby={errors.departDate ? 'depart-error' : undefined}
              required
            />
            {errors.departDate && (
              <span id="depart-error" className="error-message" role="alert">
                {errors.departDate}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="returnDate">Return Date (Optional):</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={values.returnDate}
              onChange={handleChange('returnDate')}
              aria-label="Return date (optional)"
              aria-invalid={!!errors.returnDate}
              aria-describedby={errors.returnDate ? 'return-error' : undefined}
            />
            {errors.returnDate && (
              <span id="return-error" className="error-message" role="alert">
                {errors.returnDate}
              </span>
            )}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Searching...' : 'Search Flights'}
          </button>
          {errors.submit && (
            <div className="error-message" role="alert">
              {errors.submit}
            </div>
          )}
        </form>
      </main>
      <footer>
        <p>&copy; 2024 Weeeefly. All rights reserved.</p>
      </footer>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;