import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useAppSelector = useSelector;

export const useAppDispatch = () => useDispatch();

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  
  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
  };
};

export const useSnippets = () => {
  const snippets = useAppSelector((state) => state.snippets.snippets);
  const currentSnippet = useAppSelector((state) => state.snippets.currentSnippet);
  const loading = useAppSelector((state) => state.snippets.loading);
  const error = useAppSelector((state) => state.snippets.error);
  
  return {
    snippets,
    currentSnippet,
    loading,
    error,
  };
};

export const useSettings = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const tabSize = useAppSelector((state) => state.settings.tabSize);
  const lineNumbers = useAppSelector((state) => state.settings.lineNumbers);
  const wordWrap = useAppSelector((state) => state.settings.wordWrap);
  const minimap = useAppSelector((state) => state.settings.minimap);
  const gitHubToken = useAppSelector((state) => state.settings.gitHubToken);
  const isGitHubConnected = useAppSelector((state) => state.settings.isGitHubConnected);
  const autoSave = useAppSelector((state) => state.settings.autoSave);
  const autoComplete = useAppSelector((state) => state.settings.autoComplete);
  const linting = useAppSelector((state) => state.settings.linting);
  const formatOnSave = useAppSelector((state) => state.settings.formatOnSave);
  
  return {
    theme,
    fontSize,
    tabSize,
    lineNumbers,
    wordWrap,
    minimap,
    gitHubToken,
    isGitHubConnected,
    autoSave,
    autoComplete,
    linting,
    formatOnSave,
  };
};

export const useAppSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useSettings();
  
  const updateSetting = useCallback((setting, value) => {
    // This is a generic function that can be used to update any setting
    // For example: updateSetting('theme', 'dark')
    // The actual implementation will depend on your specific actions
    console.log(`Updating setting ${setting} to ${value}`);
    // dispatch(updateSettingAction({ setting, value }));
  }, [dispatch]);
  
  return {
    ...settings,
    updateSetting,
  };
};
