import axios from 'axios';

const API_URL = '/api/auth'; // No need for http://localhost:5000 because of proxy

// Register User
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

// Login User
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};
