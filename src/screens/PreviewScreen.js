import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const PreviewScreen = () => {
  const route = useRoute();
  const webViewRef = useRef(null);
  
  // State for HTML, CSS, and JS content
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  
  // Generate HTML document with injected CSS and JS
  const generateHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html || '<div style="padding: 20px; text-align: center; color: #666;">No HTML content to display</div>'}
          <script>
            try {
              ${js}
            } catch (error) {
              console.error('Error in your JavaScript:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  // Reload WebView when content changes
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [html, css, js]);

  // Set content from route params if available (e.g., when navigating from a snippet)
  useEffect(() => {
    if (route.params?.snippet) {
      const { language, code } = route.params.snippet;
      
      if (language === 'html') {
        setHtml(code);
      } else if (language === 'css') {
        setCss(code);
      } else if (language === 'javascript') {
        setJs(code);
      }
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateHtml() }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text>Loading preview...</Text>
            </View>
          )}
        />
      </View>
      
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={[styles.toolbarButton, html ? styles.activeTab : null]}
          onPress={() => {
            setHtml(html || '<!-- Add your HTML here -->');
          }}
        >
          <Ionicons name="logo-html5" size={24} color={html ? "#007AFF" : "#666"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolbarButton, css ? styles.activeTab : null]}
          onPress={() => {
            setCss(css || '/* Add your CSS here */');
          }}
        >
          <Ionicons name="logo-css3" size={24} color={css ? "#007AFF" : "#666"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toolbarButton, js ? styles.activeTab : null]}
          onPress={() => {
            setJs(js || '// Add your JavaScript here');
          }}
        >
          <Ionicons name="logo-javascript" size={24} color={js ? "#007AFF" : "#666"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  previewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  toolbarButton: {
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});

export default PreviewScreen;
