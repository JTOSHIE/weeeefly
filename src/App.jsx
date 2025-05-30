import React, { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

// Lazy load HomePage for code splitting
const HomePage = lazy(() => import('./components/HomePage'));

function App() {
  // Monitor app-level performance in development
  if (process.env.NODE_ENV === 'development') {
    usePerformanceMonitor('App');
  }
  
  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <HomePage />
        </Suspense>
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  );
}

export default App;