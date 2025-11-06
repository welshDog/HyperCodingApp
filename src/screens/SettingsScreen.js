import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [gitHubToken, setGitHubToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load dark mode preference
      const savedDarkMode = await AsyncStorage.getItem('@dark_mode');
      if (savedDarkMode !== null) {
        setDarkMode(savedDarkMode === 'true');
      }

      // Load GitHub token if exists
      const token = await AsyncStorage.getItem('@github_token');
      if (token) {
        setGitHubToken(token);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const toggleDarkMode = async (value) => {
    try {
      setDarkMode(value);
      await AsyncStorage.setItem('@dark_mode', value.toString());
      // In a real app, you would update the theme context here
    } catch (error) {
      console.error('Failed to save dark mode preference', error);
    }
  };

  const handleGitHubConnect = async () => {
    if (!gitHubToken.trim()) {
      Alert.alert('Error', 'Please enter a valid GitHub token');
      return;
    }

    try {
      // In a real app, you would validate the token with GitHub API
      // For now, we'll just save it
      await AsyncStorage.setItem('@github_token', gitHubToken);
      setIsConnected(true);
      Alert.alert('Success', 'Successfully connected to GitHub');
    } catch (error) {
      console.error('Failed to save GitHub token', error);
      Alert.alert('Error', 'Failed to connect to GitHub');
    }
  };

  const handleGitHubDisconnect = async () => {
    try {
      await AsyncStorage.removeItem('@github_token');
      setGitHubToken('');
      setIsConnected(false);
      Alert.alert('Success', 'Disconnected from GitHub');
    } catch (error) {
      console.error('Failed to disconnect GitHub', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={24} color="#666" style={styles.settingIcon} />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>GitHub Integration</Text>
      </View>

      {!isConnected ? (
        <View style={styles.githubSection}>
          <Text style={styles.githubDescription}>
            Connect to GitHub to save and sync your code snippets to a Gist.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="GitHub Personal Access Token"
            value={gitHubToken}
            onChangeText={setGitHubToken}
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={handleGitHubConnect}
          >
            <Ionicons name="logo-github" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.connectButtonText}>Connect to GitHub</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            Generate a personal access token with 'gist' scope from GitHub Settings.
          </Text>
        </View>
      ) : (
        <View style={styles.githubSection}>
          <View style={styles.connectedStatus}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.connectedText}>Connected to GitHub</Text>
          </View>
          <TouchableOpacity 
            style={styles.disconnectButton}
            onPress={handleGitHubDisconnect}
          >
            <Ionicons name="log-out" size={16} color="#f44336" style={styles.buttonIcon} />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>About</Text>
      </View>
      
      <View style={styles.aboutSection}>
        <Text style={styles.versionText}>Hyper Coding App v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 Hyper Coding. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  githubSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  githubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: '#24292e',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disconnectButton: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  disconnectButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  aboutSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default SettingsScreen;
