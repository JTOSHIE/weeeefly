import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Notify user of new version available
    if (registration && registration.waiting) {
      if (window.confirm('New version available! Reload to update?')) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
  onSuccess: (registration) => {
    console.log('Service worker registered successfully');
  }
});