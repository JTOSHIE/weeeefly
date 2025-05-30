import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation(formRef) {
  const handleKeyDown = useCallback((e) => {
    if (!formRef.current) return;
    
    const focusableElements = formRef.current.querySelectorAll(
      'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    switch (e.key) {
      case 'Enter':
        // If on input field, move to next field
        if (e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
          e.preventDefault();
          const nextIndex = currentIndex + 1;
          if (nextIndex < focusableElements.length) {
            focusableElements[nextIndex].focus();
          }
        }
        break;
        
      case 'Escape':
        // Clear current field
        if (e.target.tagName === 'INPUT') {
          e.target.value = '';
          e.target.dispatchEvent(new Event('input', { bubbles: true }));
        }
        break;
        
      case 'Tab':
        // Default tab behavior, but we can enhance it if needed
        break;
        
      default:
        break;
    }
  }, [formRef]);
  
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    form.addEventListener('keydown', handleKeyDown);
    
    return () => {
      form.removeEventListener('keydown', handleKeyDown);
    };
  }, [formRef, handleKeyDown]);
  
  return {
    handleKeyDown
  };
}