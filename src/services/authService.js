import api from './api';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your web client ID
  offlineAccess: true,
});

const authService = {
  // Email/Password Authentication
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return this.handleAuthResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return this.handleAuthResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async forgotPassword(email) {
    try {
      await api.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async resetPassword(token, newPassword) {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Social Authentication
  async googleSignIn() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Get the user's ID token
      const token = await userCredential.user.getIdToken();
      
      // Send the token to your backend
      const response = await api.post('/auth/google', { token });
      return this.handleAuthResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Session Management
  async refreshToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return this.handleAuthResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout() {
    try {
      // Sign out from Google if signed in
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
      
      // Call your backend logout endpoint
      await api.post('/auth/logout');
      
      // Clear local storage
      await this.clearAuthTokens();
      
      return { success: true };
    } catch (error) {
      // Even if logout fails, clear local storage
      await this.clearAuthTokens();
      throw this.handleError(error);
    }
  },

  // Token Management
  async getAccessToken() {
    return await AsyncStorage.getItem('@auth_token');
  },

  async getRefreshToken() {
    return await AsyncStorage.getItem('@refresh_token');
  },

  async setAuthTokens({ token, refreshToken }) {
    await AsyncStorage.setItem('@auth_token', token);
    if (refreshToken) {
      await AsyncStorage.setItem('@refresh_token', refreshToken);
    }
  },

  async clearAuthTokens() {
    await AsyncStorage.multiRemove(['@auth_token', '@refresh_token', '@user_data']);
  },

  // Helper Methods
  async handleAuthResponse(data) {
    const { token, refreshToken, user } = data;
    
    // Store tokens
    await this.setAuthTokens({ token, refreshToken });
    
    // Store user data
    if (user) {
      await AsyncStorage.setItem('@user_data', JSON.stringify(user));
    }
    
    // Update axios default headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { user, token, refreshToken };
  },

  handleError(error) {
    console.error('Auth Error:', error);
    
    // Handle specific error codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid request');
        case 401:
          return new Error('Your session has expired. Please log in again.');
        case 403:
          return new Error('You do not have permission to perform this action');
        case 404:
          return new Error('The requested resource was not found');
        case 429:
          return new Error('Too many requests. Please try again later.');
        case 500:
          return new Error('An unexpected error occurred. Please try again later.');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return error instanceof Error ? error : new Error('An unknown error occurred');
    }
  },
};

export default authService;
