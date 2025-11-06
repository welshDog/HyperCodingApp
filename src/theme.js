import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    accent: '#007AFF',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
  roundness: 8,
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    accent: '#007AFF',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    notification: '#f50057',
  },
  roundness: 8,
};
