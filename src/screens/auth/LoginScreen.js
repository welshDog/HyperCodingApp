import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAppSelector';
import AuthLayout from '../../components/auth/AuthLayout';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { loading } = useAuth();

  const handleLogin = async (values) => {
    try {
      // This would be replaced with your actual login logic
      console.log('Login attempt with:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // On successful login, the auth state will be updated by the auth slice
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Implement Google Sign-In
      console.log('Google login');
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Google Login Failed', error.message || 'An error occurred');
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue to Hyper Coding"
    >
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              label="Email"
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={touched.email && errors.email}
              style={styles.input}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              label="Password"
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={isPasswordVisible ? "eye-off" : "eye"} 
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={!isPasswordVisible}
              error={touched.password && errors.password}
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={{ color: theme.colors.primary }}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.text + '40' }]} />
              <Text style={[styles.dividerText, { color: theme.colors.text + '80' }]}>OR</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.text + '40' }]} />
            </View>

            <Button
              mode="outlined"
              onPress={handleGoogleLogin}
              icon="google"
              style={[styles.socialButton, { borderColor: theme.colors.text + '40' }]}
              labelStyle={{ color: theme.colors.text }}
              contentStyle={styles.socialButtonContent}
            >
              Continue with Google
            </Button>

            <View style={styles.footer}>
              <Text style={{ color: theme.colors.text + '80' }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  socialButton: {
    marginBottom: 16,
  },
  socialButtonContent: {
    flexDirection: 'row-reverse',
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
