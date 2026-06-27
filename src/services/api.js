import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://draft-backend-0s8w.onrender.com';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      success: false,
      message: error.response?.data?.message || 'An unexpected system error occurred.',
      data: null,
      status: error.response?.status
    };
    return Promise.reject(normalizedError);
  }
);

export default apiClient;