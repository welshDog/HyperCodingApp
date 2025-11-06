import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MenuProvider } from 'react-native-popup-menu';

// Import navigation
import RootNavigator from './src/navigation/RootNavigator';

// Import Redux store
import { store, persistor } from './src/store';

// Import themes
import { theme, darkTheme } from './src/theme';

// Wrapper component to handle theme changes
const AppContent = () => {
  const isDarkMode = false; // You can get this from your Redux store
  const appTheme = isDarkMode ? darkTheme : theme;

  return (
    <PaperProvider theme={appTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <MenuProvider>
        <RootNavigator />
      </MenuProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </ReduxProvider>
  );
}
