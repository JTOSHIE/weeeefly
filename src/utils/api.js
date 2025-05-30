import axios from 'axios';
import { API_ENDPOINTS } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const flightAPI = {
  searchFlights: async (searchParams) => {
    try {
      const response = await api.post(API_ENDPOINTS.FLIGHT_SEARCH, searchParams);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search flights');
    }
  },

  getFlightDetails: async (flightId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.FLIGHT_DETAILS}/${flightId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get flight details');
    }
  },

  bookFlight: async (bookingData) => {
    try {
      const response = await api.post(API_ENDPOINTS.BOOKING, bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book flight');
    }
  },
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};