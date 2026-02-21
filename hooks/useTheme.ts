
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && 'theme' in localStorage) {
      return localStorage.theme as Theme;
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (targetTheme: Theme) => {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (targetTheme === 'dark' || (targetTheme === 'system' && isSystemDark)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      localStorage.removeItem('theme');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      localStorage.theme = theme;
    }
  }, [theme]);

  return { theme, setTheme };
};
