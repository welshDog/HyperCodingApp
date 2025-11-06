import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import AuthLayout from '../../components/auth/AuthLayout';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

const ForgotPasswordScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      // This would be replaced with your actual password reset logic
      console.log('Password reset requested for:', values.email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success
      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle={`We've sent password reset instructions to your email address.`}
      >
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: theme.colors.text + '80' }]}>
            If you don't see the email, check your spam folder or request a new one.
          </Text>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Back to Login
          </Button>
          
          <TouchableOpacity 
            style={styles.resendLink}
            onPress={() => setIsSubmitted(false)}
          >
            <Text style={{ color: theme.colors.primary }}>Resend Email</Text>
          </TouchableOpacity>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password" 
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleResetPassword}
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

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Send Reset Link
            </Button>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: theme.colors.primary }}>Back to Login</Text>
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
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  resendLink: {
    marginTop: 24,
  },
});

export default ForgotPasswordScreen;
