import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthLayout from '../../components/auth/AuthLayout';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPasswordScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the reset token from the URL or navigation params
  const token = route.params?.token || '';
  const email = route.params?.email || '';

  const handleResetPassword = async (values) => {
    try {
      setIsLoading(true);
      // This would be replaced with your actual password reset logic
      console.log('Resetting password with token:', token);
      console.log('New password:', values.password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success
      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated successfully. You can now log in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Create a new password for your account"
    >
      <Formik
        initialValues={{ 
          email: email,
          password: '',
          confirmPassword: '' 
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            {email ? (
              <TextInput
                label="Email"
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
                value={email}
                editable={false}
                style={[styles.input, { backgroundColor: theme.colors.surfaceDisabled }]}
              />
            ) : null}

            <TextInput
              label="New Password"
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
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.password && errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : (
              <Text style={[styles.hintText, { color: theme.colors.text + '60' }]}>
                Use 8+ characters with a mix of letters, numbers & symbols
              </Text>
            )}

            <TextInput
              label="Confirm New Password"
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
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Reset Password
            </Button>
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
  hintText: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});

export default ResetPasswordScreen;
