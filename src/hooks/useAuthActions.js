import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { clearCurrentSnippet } from '../store/slices/snippetsSlice';

export const useAuthActions = () => {
  const dispatch = useDispatch();

  const login = useCallback(async (email, password) => {
    dispatch(loginStart());
    try {
      // Replace with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              id: '1',
              email,
              name: email.split('@')[0],
              avatar: null,
            },
            token: 'dummy-jwt-token',
          });
        }, 1000);
      });

      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  const googleLogin = useCallback(async () => {
    dispatch(loginStart());
    try {
      // Implement Google Sign-In
      // const { user, token } = await GoogleSignin.signIn();
      // dispatch(loginSuccess({ user, token }));
      // return { user, token };
      
      // Temporary mock response
      const mockResponse = {
        user: {
          id: 'google-123',
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: 'https://via.placeholder.com/150',
        },
        token: 'google-dummy-token',
      };
      
      dispatch(loginSuccess(mockResponse));
      return mockResponse;
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.message || 'Google login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }, [dispatch]);

  const signOut = useCallback(() => {
    try {
      // Clear any stored credentials
      // await GoogleSignin.signOut();
      
      // Clear app state
      dispatch(logout());
      dispatch(clearCurrentSnippet());
      
      // Clear any stored data
      // await AsyncStorage.clear();
      
      return true;
    } catch (error) {
      console.error('Error during sign out:', error);
      return false;
    }
  }, [dispatch]);

  return {
    login,
    googleLogin,
    signOut,
  };
};

export default useAuthActions;
