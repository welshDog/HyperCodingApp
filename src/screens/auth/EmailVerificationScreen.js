import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import emailVerification from '../../utils/emailVerification';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../hooks/useAppSelector';

const EmailVerificationScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isEmailVerified: isVerified } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Check email verification status
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          navigation.replace('Login');
          return;
        }

        await user.reload();
        
        if (user.emailVerified) {
          // Email is verified, navigate to the app
          navigation.replace('App');
          return;
        }
        
        setError('');
      } catch (error) {
        console.error('Error checking verification:', error);
        setError('Failed to check verification status. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkVerification();

    // Set up interval to check verification status
    const interval = setInterval(checkVerification, 5000);
    
    // Set up deep linking for email verification
    const handleDeepLink = async ({ url }) => {
      if (url.includes('mode=verifyEmail')) {
        try {
          setIsLoading(true);
          await emailVerification.handleVerifyEmail(url);
          navigation.replace('App', { screen: 'Home' });
        } catch (error) {
          setError(error.message || 'Failed to verify email');
        } finally {
          setIsLoading(false);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Clean up
    return () => {
      clearInterval(interval);
      subscription?.remove();
    };
  }, [navigation]);

  // Handle resend verification email
  const handleResendEmail = async () => {
    try {
      setIsSending(true);
      setError('');
      await emailVerification.resendVerificationEmail();
      
      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Handle open email app
  const handleOpenEmailApp = async () => {
    try {
      // This will open the default email app
      await Linking.openURL('message://');
    } catch (error) {
      console.error('Error opening email app:', error);
      // Fallback to Gmail if the default app can't be opened
      await Linking.openURL('googlegmail://');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Verifying your email...
        </Text>
      </View>
    );
  }

  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle={`We've sent a verification email to ${auth().currentUser?.email}`}
    >
      <View style={styles.content}>
        <Text style={[styles.instructions, { color: theme.colors.text }]}>
          Please check your email and click the verification link to activate your account.
        </Text>
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleOpenEmailApp}
          style={[styles.button, { marginTop: 24 }]}
          icon="email"
        >
          Open Email App
        </Button>

        <Button
          mode="outlined"
          onPress={handleResendEmail}
          disabled={countdown > 0 || isSending}
          loading={isSending}
          style={styles.button}
          icon="email-sync"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
        </Button>

        <Button
          mode="text"
          onPress={() => auth().signOut()}
          style={styles.button}
          textColor={theme.colors.error}
        >
          Sign Out
        </Button>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 12,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;
