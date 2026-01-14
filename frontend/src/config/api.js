// API configuration for production and development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
