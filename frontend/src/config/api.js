// API configuration for production and development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const { token } = JSON.parse(user);
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            // Invalid JSON in localStorage
        }
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        }

        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        return response;
    } catch (error) {
        // Re-throw with better error message
        throw error;
    }
};

// Convenience methods
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export default api;
