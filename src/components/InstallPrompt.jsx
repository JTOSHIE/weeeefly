import React, { useState, useEffect } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const { isInstallable, isInstalled, install, getInstallInstructions } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const isDismissed = localStorage.getItem('install-prompt-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }

    // Show prompt after 30 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !isDismissed && !isInstalled) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const result = await install();
    if (!result) {
      // If install wasn't available or was cancelled, show manual instructions
      setShowInstructions(true);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  const instructions = getInstallInstructions();

  if (isInstalled || (!isInstallable && !showInstructions)) {
    return null;
  }

  if (showInstructions) {
    return (
      <div className="install-instructions" role="dialog" aria-labelledby="install-instructions-title">
        <div className="install-instructions-content">
          <h3 id="install-instructions-title">Install Weeeefly</h3>
          <p>To install Weeeefly on your device:</p>
          <ol>
            {instructions.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <button 
            onClick={() => setShowInstructions(false)}
            className="install-instructions-close"
            aria-label="Close instructions"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="install-prompt" role="dialog" aria-labelledby="install-prompt-title">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">✈️</div>
        <div className="install-prompt-text">
          <h3 id="install-prompt-title">Install Weeeefly</h3>
          <p>Get instant access to cheap flights from your home screen!</p>
        </div>
        <div className="install-prompt-actions">
          <button 
            onClick={handleInstall}
            className="install-prompt-button install-prompt-install"
            aria-label="Install Weeeefly app"
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            className="install-prompt-button install-prompt-dismiss"
            aria-label="Dismiss install prompt"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;