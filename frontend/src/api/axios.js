import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 60000, // 60 seconds for AI generation
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('edu_companion_user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only redirect if NOT an auth request
            const isAuthRequest = error.config.url.includes('/auth/');
            if (!isAuthRequest) {
                localStorage.removeItem('edu_companion_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
