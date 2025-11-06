import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import SnippetVaultScreen from '../screens/SnippetVaultScreen';
import PreviewScreen from '../screens/PreviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CodeEditorScreen from '../screens/CodeEditorScreen';

const Tab = createBottomTabNavigator();
const VaultStack = createStackNavigator();

// Vault Stack Navigator
function VaultStackNavigator() {
  return (
    <VaultStack.Navigator>
      <VaultStack.Screen 
        name="Vault" 
        component={SnippetVaultScreen} 
        options={{ title: 'Code Vault' }}
      />
      <VaultStack.Screen 
        name="CodeEditor" 
        component={CodeEditorScreen} 
        options={{ title: 'Code Editor' }}
      />
    </VaultStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Vault') {
              iconName = focused ? 'code-working' : 'code-working-outline';
            } else if (route.name === 'Preview') {
              iconName = focused ? 'eye' : 'eye-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Vault" 
          component={VaultStackNavigator} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Preview" 
          component={PreviewScreen} 
          options={{ title: 'Live Preview' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
