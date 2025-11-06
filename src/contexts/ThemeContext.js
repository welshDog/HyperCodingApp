import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../hooks/useAppSelector';
import { theme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme } = useAppSelector((state) => ({
    theme: state.settings.theme,
  }));

  // Determine the current theme based on user preference or system setting
  const currentTheme = useMemo(() => {
    if (userTheme === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : theme;
    }
    return userTheme === 'dark' ? darkTheme : theme;
  }, [userTheme, systemColorScheme]);

  // Apply theme to the status bar and other system UI
  useEffect(() => {
    // You can add more theme-related side effects here
    // For example, updating the status bar color
    // StatusBar.setBarStyle(currentTheme.dark ? 'light-content' : 'dark-content');
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
