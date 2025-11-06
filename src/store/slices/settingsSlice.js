import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

// Get system color scheme
const colorScheme = Appearance.getColorScheme();

const initialState = {
  theme: colorScheme || 'light',
  fontSize: 14,
  tabSize: 2,
  lineNumbers: true,
  wordWrap: true,
  minimap: {
    enabled: true,
    showSlider: 'always',
  },
  gitHubToken: null,
  isGitHubConnected: false,
  autoSave: true,
  autoComplete: true,
  linting: true,
  formatOnSave: true,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setTabSize: (state, action) => {
      state.tabSize = action.payload;
    },
    toggleLineNumbers: (state) => {
      state.lineNumbers = !state.lineNumbers;
    },
    toggleWordWrap: (state) => {
      state.wordWrap = !state.wordWrap;
    },
    toggleMinimap: (state) => {
      state.minimap.enabled = !state.minimap.enabled;
    },
    setGitHubToken: (state, action) => {
      state.gitHubToken = action.payload;
      state.isGitHubConnected = !!action.payload;
    },
    disconnectGitHub: (state) => {
      state.gitHubToken = null;
      state.isGitHubConnected = false;
    },
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave;
    },
    toggleAutoComplete: (state) => {
      state.autoComplete = !state.autoComplete;
    },
    toggleLinting: (state) => {
      state.linting = !state.linting;
    },
    toggleFormatOnSave: (state) => {
      state.formatOnSave = !state.formatOnSave;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setFontSize,
  setTabSize,
  toggleLineNumbers,
  toggleWordWrap,
  toggleMinimap,
  setGitHubToken,
  disconnectGitHub,
  toggleAutoSave,
  toggleAutoComplete,
  toggleLinting,
  toggleFormatOnSave,
  setLoading,
  setError,
  clearError,
} = settingsSlice.actions;

export const selectTheme = (state) => state.settings.theme;
export const selectFontSize = (state) => state.settings.fontSize;
export const selectTabSize = (state) => state.settings.tabSize;
export const selectLineNumbers = (state) => state.settings.lineNumbers;
export const selectWordWrap = (state) => state.settings.wordWrap;
export const selectMinimap = (state) => state.settings.minimap;
export const selectGitHubToken = (state) => state.settings.gitHubToken;
export const selectIsGitHubConnected = (state) => state.settings.isGitHubConnected;
export const selectAutoSave = (state) => state.settings.autoSave;
export const selectAutoComplete = (state) => state.settings.autoComplete;
export const selectLinting = (state) => state.settings.linting;
export const selectFormatOnSave = (state) => state.settings.formatOnSave;
export const selectSettingsLoading = (state) => state.settings.loading;
export const selectSettingsError = (state) => state.settings.error;

export default settingsSlice.reducer;
