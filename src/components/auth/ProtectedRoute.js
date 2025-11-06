import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAppSelector';
import authService from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const navigation = useNavigation();
  const { isAuthenticated, user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // If not authenticated, try to refresh the token
        if (!isAuthenticated) {
          const token = await authService.getAccessToken();
          
          if (token) {
            // Try to refresh the token
            await authService.refreshToken();
            // The auth state will be updated by the interceptor
            return;
          }
          
          // No valid token, redirect to login
          navigation.replace('Auth', { screen: 'Login' });
          return;
        }

        // Check if user has required role if specified
        if (requiredRole && user?.role !== requiredRole) {
          // User doesn't have the required role
          navigation.replace('Unauthorized');
          return;
        }

        // User is authenticated and authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth verification error:', error);
        // Clear any invalid tokens
        await authService.clearAuthTokens();
        // Redirect to login with a message
        navigation.replace('Auth', { 
          screen: 'Login',
          params: { message: 'Your session has expired. Please log in again.' }
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, user, requiredRole, navigation]);

  // Show loading indicator while verifying
  if (isVerifying || (loading && !isAuthenticated)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If not authorized, return null (will be handled by the effect)
  if (!isAuthorized) {
    return null;
  }

  // If authorized, render the protected content
  return children;
};

export default ProtectedRoute;
