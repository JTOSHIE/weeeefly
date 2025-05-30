import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // Check for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                                window.navigator.standalone ||
                                document.referrer.includes('android-app://');
      
      setIsInstalled(isInStandaloneMode);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === 'accepted';
  };

  const getInstallInstructions = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
    const isChrome = /chrome/.test(ua) && !/edge/.test(ua);

    if (isIOS && isSafari) {
      return {
        platform: 'ios-safari',
        steps: [
          'Tap the Share button',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install Weeeefly'
        ]
      };
    }

    if (isAndroid && isChrome) {
      return {
        platform: 'android-chrome',
        steps: [
          'Tap the menu button (three dots)',
          'Tap "Add to Home screen"',
          'Tap "Add" to install Weeeefly'
        ]
      };
    }

    return {
      platform: 'other',
      steps: [
        'Look for an install button in your browser\'s menu',
        'Or try using Chrome or Safari for the best experience'
      ]
    };
  };

  return {
    isInstallable,
    isInstalled,
    install,
    getInstallInstructions
  };
};