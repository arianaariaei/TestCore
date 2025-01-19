import axios from 'axios';

// Base API configuration
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});


export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            // Store the token when login is successful
            localStorage.setItem('token', response.data.access_token);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/signup', userData);
            // Store the token when registration is successful
            localStorage.setItem('token', response.data.access_token);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
};

// Exam related API calls
export const examService = {
    createExam: async (examData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.post('/exams/', examData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating exam:', error);
            throw error;
        }
    }
};