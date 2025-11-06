import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import api from '../services/api';

const emailVerification = {
  // Send verification email
  async sendVerificationEmail() {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      await user.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://yourapp.page.link/email-verification', // Replace with your dynamic link
      });
      
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  },

  // Check if email is verified
  isEmailVerified() {
    const user = auth().currentUser;
    return user ? user.emailVerified : false;
  },

  // Handle email verification action
  async handleVerifyEmail(actionCode) {
    try {
      // Apply the email verification code
      await auth().applyActionCode(actionCode);
      
      // Update user's email verification status
      await auth().currentUser.reload();
      
      // Notify your backend about the verification
      await api.post('/auth/verify-email', { actionCode });
      
      return true;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error('Failed to verify email. The link may have expired or is invalid.');
    }
  },

  // Resend verification email with cooldown
  async resendVerificationEmail() {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      // You might want to implement rate limiting here
      // For example, check when the last email was sent
      const lastSent = await AsyncStorage.getItem('@last_verification_email');
      if (lastSent) {
        const lastSentTime = new Date(parseInt(lastSent, 10));
        const now = new Date();
        const diffInMinutes = (now - lastSentTime) / (1000 * 60);
        
        if (diffInMinutes < 1) { // 1 minute cooldown
          throw new Error('Please wait before requesting another verification email');
        }
      }
      
      await this.sendVerificationEmail();
      await AsyncStorage.setItem('@last_verification_email', Date.now().toString());
      
      return true;
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  },

  // Check verification status periodically
  startVerificationCheck(callback) {
    const interval = setInterval(async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(interval);
            callback(true);
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        clearInterval(interval);
        callback(false, error);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  },

  // Show verification prompt
  showVerificationPrompt() {
    Alert.alert(
      'Verify Your Email',
      'Please verify your email address to access all features. Check your inbox for the verification email.',
      [
        {
          text: 'Resend Email',
          onPress: () => this.resendVerificationEmail().catch(console.error),
        },
        {
          text: 'I\'ve Verified',
          onPress: () => {
            auth().currentUser.reload();
          },
        },
      ],
      { cancelable: false }
    );
  },
};

export default emailVerification;
