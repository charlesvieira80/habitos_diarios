import { useState, useEffect } from 'react';

const AUTH_KEY = 'habit-tracker-auth-pwd';

export const useAuth = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [hasPasswordSet, setHasPasswordSet] = useState(false);

  useEffect(() => {
    // Check if a password exists in localStorage on mount
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      setHasPasswordSet(true);
    }
  }, []);

  const login = (password: string): boolean => {
    const stored = localStorage.getItem(AUTH_KEY);
    // Simple comparison (in a real app, use hashing)
    if (stored === password) {
      setIsParentMode(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsParentMode(false);
  };

  const setPassword = (newPassword: string) => {
    localStorage.setItem(AUTH_KEY, newPassword);
    setHasPasswordSet(true);
    setIsParentMode(true); // Auto login after setting
  };

  return {
    isParentMode,
    hasPasswordSet,
    login,
    logout,
    setPassword
  };
};