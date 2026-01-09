import axios from 'axios';

// Function to determine the base URL based on the environment
const getBaseUrl = () => {
    // If a specific backend URL is defined in the environment, use it
    if (process.env.REACT_APP_BACKEND_URL) {
        return process.env.REACT_APP_BACKEND_URL;
    }

    // Default for local development if no env var is set
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001';
    }

    // Fallback/Default behavior (useful if served from same origin)
    return '';
};

const client = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;
