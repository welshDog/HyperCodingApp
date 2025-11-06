import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SnippetVaultScreen = () => {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Load snippets from storage
  const loadSnippets = async () => {
    try {
      const savedSnippets = await AsyncStorage.getItem('@code_snippets');
      if (savedSnippets) {
        setSnippets(JSON.parse(savedSnippets));
      }
    } catch (error) {
      console.error('Failed to load snippets', error);
      Alert.alert('Error', 'Failed to load code snippets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSnippets);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.snippetItem}
      onPress={() => navigation.navigate('CodeEditor', { snippet: item })}
    >
      <Text style={styles.snippetTitle}>{item.title}</Text>
      <Text style={styles.snippetLanguage}>{item.language}</Text>
      <Text style={styles.snippetPreview} numberOfLines={1}>
        {item.code.substring(0, 50)}{item.code.length > 50 ? '...' : ''}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading snippets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={snippets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No snippets yet. Tap + to create one!</Text>
          </View>
        }
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CodeEditor', { 
          snippet: { 
            id: Date.now().toString(),
            title: 'Untitled Snippet',
            language: 'javascript',
            code: '// Start coding here...',
            createdAt: new Date().toISOString()
          } 
        })}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  snippetItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  snippetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  snippetLanguage: {
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  snippetPreview: {
    color: '#888',
    fontFamily: 'Courier',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default SnippetVaultScreen;
