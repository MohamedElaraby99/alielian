import axios from 'axios';

// Determine base URL based on environment
const getBaseUrl = () => {
  // Check if we're in production
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://lms.alielian.online/api/v1';
  }
  // Development fallback
  return import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4001/api/v1';
};

const BASE_URL = getBaseUrl();

// Create axios instance with proper CORS configuration
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Keep this for authentication
    timeout: 30000, // 30 second timeout
    headers: {
        'Accept': 'application/json'
    }
});

// Add request interceptor to include device info in headers for cross-domain requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure correct headers for FormData uploads
        const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
        if (isFormData) {
            if (config.headers) {
                delete config.headers['Content-Type'];
                delete config.headers['content-type'];
            }
        } else {
            // Default to JSON for non-FormData requests
            if (config.headers && !config.headers['Content-Type'] && !config.headers['content-type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        // Add device info to headers for cross-domain requests
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            try {
                // Generate basic device info for cross-domain requests
                const deviceInfo = {
                    platform: navigator.platform || 'unknown',
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    userAgent: navigator.userAgent
                };
                
                config.headers['x-device-info'] = JSON.stringify(deviceInfo);
            } catch (error) {
                console.log('Failed to add device info to headers:', error);
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 403 && error.response?.data?.message?.includes('DEVICE_NOT_AUTHORIZED')) {
            // Handle device authorization errors
            console.error('Device not authorized:', error.response.data);
            // You could redirect to login or show a device authorization message
        }
        return Promise.reject(error);
    }
);