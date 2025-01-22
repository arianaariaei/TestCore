import axios from 'axios';

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
            localStorage.setItem('token', response.data.access_token);
            return {
                is_admin: response.data.User.is_admin,
            };
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error);
            throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/signup', userData);
            localStorage.setItem('token', response.data.access_token);

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
            console.error('Registration error:', errorMessage);
            throw new Error(errorMessage);
        }
    }
    
};

export const examService = {
    getUserExams: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get('/exams/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; 
        } catch (error) {
            console.error('Error fetching user exams:', error);
            throw error;
        }
    },

    getAllUsers: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get('/admin/users/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    },

    getAllExams: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get('/admin/exams/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all exams:', error);
            throw error;
        }
    },

    getUserExamDetails: async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get(`/admin/users/${userId}/exams`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user exam details:', error);
            throw error;
        }
    },

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
    },

    deleteExam: async (examId) => {
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/exams/${examId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error deleting exam:', error);
            throw error;
        }
    },

    getExamById: async (examId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get(`/exams/${examId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching exam by ID:', error);
            throw error;
        }
    },

    updateExam: async (examId, examData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.put(`/exams/${examId}`, examData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating exam:', error);
            throw error;
        }
    },
    deleteUser: async (userId) => {
        const token = localStorage.getItem('token');
        try {
          await api.delete(`/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },
      getExamsBySubject: async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get('/reports/exams-by-subject', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching exams by subject:', error);
            throw error;
        }
    },

    getUserExamCount: async () => {
        try {
            const response = await api.get('/reports/users-exam-count', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error) {

            throw new Error('Failed to fetch user exam counts: ' + error.message);
        }
    },
};