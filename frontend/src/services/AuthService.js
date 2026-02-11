import api from '../api/axios';

/**
 * Auth Service Module
 * Handles user authentication via Backend API
 */
export class AuthService {
    constructor() {
        this.SESSION_KEY = 'edu_companion_user';
    }

    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    async signup(data) {
        try {
            const response = await api.post('/auth/signup', data);
            if (response.data.token) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Signup Service Error:", error);
            const message = error.response?.data?.message || 'Signup failed. Please try again.';
            throw new Error(message);
        }
    }

    async updateProfile(data) {
        try {
            const response = await api.put('/auth/profile', data);
            if (response.data.token) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Profile update failed');
        }
    }

    logout(shouldReload = true) {
        localStorage.removeItem(this.SESSION_KEY);
        // Force reload or redirect handled by component
        if (shouldReload) {
            window.location.reload();
        }
    }

    getUser() {
        const userStr = localStorage.getItem(this.SESSION_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem(this.SESSION_KEY); // Clear bad data
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getUser();
    }
}

export const authService = new AuthService();
