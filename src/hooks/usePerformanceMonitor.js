import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const renderStartTime = useRef(null);
  
  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    
    if (renderStartTime.current) {
      const renderDuration = renderEndTime - renderStartTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName}:`, {
          renderCount: renderCount.current,
          renderDuration: `${renderDuration.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        });
        
        // Warn if render takes too long
        if (renderDuration > 16.67) { // 60fps threshold
          console.warn(`[Performance Warning] ${componentName} render took ${renderDuration.toFixed(2)}ms (> 16.67ms)`);
        }
      }
    }
  });
  
  // Track render start time
  renderStartTime.current = performance.now();
  
  // Measure component lifecycle
  useEffect(() => {
    const mountTime = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const lifetimeDuration = unmountTime - mountTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} unmounted:`, {
          totalRenders: renderCount.current,
          lifetime: `${lifetimeDuration.toFixed(2)}ms`
        });
      }
    };
  }, [componentName]);
  
  return {
    renderCount: renderCount.current
  };
}