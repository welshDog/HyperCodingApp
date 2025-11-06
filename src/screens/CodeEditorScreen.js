import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CodeEditorScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isNewSnippet, setIsNewSnippet] = useState(true);
  const [snippetId, setSnippetId] = useState('');

  // Initialize with route params if editing existing snippet
  useEffect(() => {
    if (route.params?.snippet) {
      const { id, title, language, code } = route.params.snippet;
      setTitle(title);
      setLanguage(language);
      setCode(code);
      setSnippetId(id);
      setIsNewSnippet(false);
    }
  }, [route.params]);

  const saveSnippet = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your snippet');
      return;
    }

    try {
      const newSnippet = {
        id: snippetId || Date.now().toString(),
        title: title.trim(),
        language,
        code,
        updatedAt: new Date().toISOString(),
        createdAt: route.params?.snippet?.createdAt || new Date().toISOString()
      };

      // Get existing snippets
      const savedSnippets = await AsyncStorage.getItem('@code_snippets');
      let snippets = [];
      
      if (savedSnippets) {
        snippets = JSON.parse(savedSnippets);
        
        // Update existing snippet if it exists
        const existingSnippetIndex = snippets.findIndex(s => s.id === newSnippet.id);
        if (existingSnippetIndex !== -1) {
          snippets[existingSnippetIndex] = newSnippet;
        } else {
          snippets.push(newSnippet);
        }
      } else {
        snippets = [newSnippet];
      }

      // Save back to storage
      await AsyncStorage.setItem('@code_snippets', JSON.stringify(snippets));
      
      // Navigate back to vault
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save snippet', error);
      Alert.alert('Error', 'Failed to save the code snippet');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Snippet Title"
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={saveSnippet} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languagePickerContainer}>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue) => setLanguage(itemValue)}
          style={styles.picker}
          dropdownIconColor="#007AFF"
        >
          <Picker.Item label="JavaScript" value="javascript" />
          <Picker.Item label="TypeScript" value="typescript" />
          <Picker.Item label="HTML" value="html" />
          <Picker.Item label="CSS" value="css" />
          <Picker.Item label="Python" value="python" />
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="C++" value="cpp" />
          <Picker.Item label="C#" value="csharp" />
          <Picker.Item label="PHP" value="php" />
          <Picker.Item label="Ruby" value="ruby" />
        </Picker>
      </View>

      <TextInput
        style={styles.codeInput}
        value={code}
        onChangeText={setCode}
        placeholder="// Start coding here..."
        placeholderTextColor="#888"
        multiline
        textAlignVertical="top"
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: '#333',
  },
  saveButton: {
    padding: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  languagePickerContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  picker: {
    height: 50,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: 16,
    fontFamily: 'Courier',
    fontSize: 14,
  },
});
