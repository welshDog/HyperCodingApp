import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { getAppCheckToken, getToken } from 'firebase/app-check';
import { firebase } from '@react-native-firebase/app-check';
import { Platform } from 'react-native';

// Initialize reCAPTCHA verifier
let recaptchaVerifier = null;

export const security = {
  // Initialize reCAPTCHA
  initializeRecaptcha(recaptchaContainer) {
    if (Platform.OS === 'web' && window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }
    
    // For web
    if (Platform.OS === 'web') {
      window.recaptchaVerifier = new auth.RecaptchaVerifier(recaptchaContainer, {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log('reCAPTCHA expired');
        }
      });
      return window.recaptchaVerifier;
    }
    
    // For mobile, we'll use Firebase App Check with reCAPTCHA Enterprise
    return null;
  },

  // Initialize App Check
  async initializeAppCheck() {
    if (Platform.OS !== 'web') {
      try {
        const rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
        
        // Configure App Check with reCAPTCHA Enterprise
        rnfbProvider.configure({
          android: {
            provider: __DEV__ ? 'debug' : 'playIntegrity',
            debugToken: 'YOUR_DEBUG_TOKEN' // Only for development
          },
          apple: {
            provider: __DEV__ ? 'debug' : 'appAttest',
            debugToken: 'YOUR_DEBUG_TOKEN' // Only for development
          },
          web: {
            provider: 'reCaptchaV3',
            siteKey: 'YOUR_RECAPTCHA_V3_SITE_KEY'
          },
        });

        // Initialize App Check
        await firebase.appCheck().initializeAppCheck({
          provider: rnfbProvider,
          isTokenAutoRefreshEnabled: true
        });

        console.log('App Check initialized');
      } catch (error) {
        console.error('Error initializing App Check:', error);
      }
    }
  },

  // Get App Check token
  async getAppCheckToken() {
    try {
      if (Platform.OS === 'web') {
        const { getToken } = await import('firebase/app-check');
        const appCheckToken = await getToken();
        return appCheckToken;
      } else {
        const appCheckToken = await getToken(firebase.appCheck(), false);
        return appCheckToken.token;
      }
    } catch (error) {
      console.error('Error getting App Check token:', error);
      return null;
    }
  },

  // Rate limiting function
  async checkRateLimit(action, userId) {
    try {
      const now = Date.now();
      const db = firebase.firestore();
      const rateLimitRef = db.collection('rateLimits').doc(userId);
      
      const doc = await rateLimitRef.get();
      
      if (!doc.exists) {
        // First action for this user
        await rateLimitRef.set({
          [action]: {
            count: 1,
            lastAttempt: now
          }
        });
        return { allowed: true, remaining: 4 }; // 5 attempts allowed
      }
      
      const userData = doc.data();
      const actionData = userData[action] || { count: 0, lastAttempt: 0 };
      
      // Reset counter if last attempt was more than 1 hour ago
      if (now - actionData.lastAttempt > 3600000) {
        await rateLimitRef.update({
          [action]: {
            count: 1,
            lastAttempt: now
          }
        });
        return { allowed: true, remaining: 4 }; // 5 attempts allowed
      }
      
      // Check if user has exceeded the limit
      if (actionData.count >= 5) {
        return { 
          allowed: false, 
          remaining: 0,
          retryAfter: Math.ceil((3600000 - (now - actionData.lastAttempt)) / 60000) // in minutes
        };
      }
      
      // Increment the counter
      await rateLimitRef.update({
        [action]: {
          count: actionData.count + 1,
          lastAttempt: now
        }
      });
      
      return { 
        allowed: true, 
        remaining: 4 - actionData.count // Remaining attempts
      };
      
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Fail open in case of errors to avoid blocking legitimate users
      return { allowed: true, remaining: 5 };
    }
  },

  // Secure API request with App Check token
  async secureApiRequest(url, options = {}) {
    try {
      const appCheckToken = await this.getAppCheckToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Firebase-AppCheck': appCheckToken,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Check if user's email is verified
  async checkEmailVerification() {
    const user = auth().currentUser;
    if (!user) return false;
    
    // Reload user to get the latest email verification status
    await user.reload();
    return user.emailVerified;
  },

  // Log security event
  logSecurityEvent(eventName, metadata = {}) {
    if (__DEV__) {
      console.log(`[Security Event] ${eventName}`, metadata);
    }
    
    // In production, you might want to log this to a security monitoring service
    // Example: logToSecurityMonitoringService(eventName, metadata);
  }
};

export default security;
