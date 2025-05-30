import { useState, useCallback } from 'react';

export function useFlightForm(initialValues = {}) {
  const [values, setValues] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    ...initialValues
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!values.origin) {
      newErrors.origin = 'Origin is required';
    }
    
    if (!values.destination) {
      newErrors.destination = 'Destination is required';
    }
    
    if (values.origin === values.destination) {
      newErrors.destination = 'Destination must be different from origin';
    }
    
    if (!values.departDate) {
      newErrors.departDate = 'Departure date is required';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departDate = new Date(values.departDate);
    
    if (departDate < today) {
      newErrors.departDate = 'Departure date must be in the future';
    }
    
    if (values.returnDate) {
      const returnDate = new Date(values.returnDate);
      if (returnDate < departDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (onSubmit) => {
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  const reset = useCallback(() => {
    setValues({
      origin: '',
      destination: '',
      departDate: '',
      returnDate: ''
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    validateForm
  };
}