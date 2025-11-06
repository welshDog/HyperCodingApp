import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://your-api-url.com/api', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': Platform.OS,
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(
          'https://your-api-url.com/api/auth/refresh-token',
          { refreshToken }
        );
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        // Store the new tokens
        await AsyncStorage.setItem('@auth_token', token);
        await AsyncStorage.setItem('@refresh_token', newRefreshToken);
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // Refresh token failed, clear storage and redirect to login
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@refresh_token');
        // You might want to dispatch a logout action here
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
