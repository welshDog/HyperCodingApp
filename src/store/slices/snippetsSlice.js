import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for loading snippets
const STORAGE_KEY = '@code_snippets';

export const loadSnippets = createAsyncThunk(
  'snippets/loadSnippets',
  async () => {
    try {
      const savedSnippets = await AsyncStorage.getItem(STORAGE_KEY);
      return savedSnippets ? JSON.parse(savedSnippets) : [];
    } catch (error) {
      throw new Error('Failed to load snippets');
    }
  }
);

export const saveSnippet = createAsyncThunk(
  'snippets/saveSnippet',
  async (snippet, { getState }) => {
    try {
      const { snippets } = getState().snippets;
      let updatedSnippets;
      
      const existingIndex = snippets.findIndex(s => s.id === snippet.id);
      
      if (existingIndex >= 0) {
        // Update existing snippet
        updatedSnippets = [...snippets];
        updatedSnippets[existingIndex] = {
          ...snippet,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Add new snippet
        updatedSnippets = [
          ...snippets,
          {
            ...snippet,
            id: snippet.id || Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSnippets));
      return updatedSnippets;
    } catch (error) {
      throw new Error('Failed to save snippet');
    }
  }
);

export const deleteSnippet = createAsyncThunk(
  'snippets/deleteSnippet',
  async (snippetId, { getState }) => {
    try {
      const { snippets } = getState().snippets;
      const updatedSnippets = snippets.filter(snippet => snippet.id !== snippetId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSnippets));
      return updatedSnippets;
    } catch (error) {
      throw new Error('Failed to delete snippet');
    }
  }
);

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState: {
    snippets: [],
    currentSnippet: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentSnippet: (state, action) => {
      state.currentSnippet = action.payload;
    },
    clearCurrentSnippet: (state) => {
      state.currentSnippet = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load snippets
    builder.addCase(loadSnippets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadSnippets.fulfilled, (state, action) => {
      state.loading = false;
      state.snippets = action.payload;
    });
    builder.addCase(loadSnippets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Save snippet
    builder.addCase(saveSnippet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveSnippet.fulfilled, (state, action) => {
      state.loading = false;
      state.snippets = action.payload;
      state.currentSnippet = null;
    });
    builder.addCase(saveSnippet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete snippet
    builder.addCase(deleteSnippet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSnippet.fulfilled, (state, action) => {
      state.loading = false;
      state.snippets = action.payload;
      state.currentSnippet = null;
    });
    builder.addCase(deleteSnippet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setCurrentSnippet, clearCurrentSnippet, clearError } = snippetsSlice.actions;

export const selectSnippets = (state) => state.snippets.snippets;
export const selectCurrentSnippet = (state) => state.snippets.currentSnippet;
export const selectSnippetsLoading = (state) => state.snippets.loading;
export const selectSnippetsError = (state) => state.snippets.error;

export default snippetsSlice.reducer;
