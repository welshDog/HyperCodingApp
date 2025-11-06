import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAppSelector';
import AuthLayout from '../../components/auth/AuthLayout';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { loading } = useAuth();

  const handleRegister = async (values) => {
    try {
      // This would be replaced with your actual registration logic
      console.log('Registration attempt with:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful registration, you might want to automatically log the user in
      // or redirect them to the login screen with a success message
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login', { email: values.email })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join Hyper Coding to start coding"
    >
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              autoCapitalize="words"
              error={touched.name && errors.name}
              style={styles.input}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

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

            <TextInput
              label="Confirm Password"
              mode="outlined"
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon 
                  icon={isConfirmPasswordVisible ? "eye-off" : "eye"} 
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                />
              }
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
              error={touched.confirmPassword && errors.confirmPassword}
              style={styles.input}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <View style={styles.footer}>
              <Text style={{ color: theme.colors.text + '80' }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Sign In</Text>
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
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});

export default RegisterScreen;
