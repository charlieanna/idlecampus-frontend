/**
 * Theme Context for Dark Mode Support
 * Provides system-wide theme management with localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme type definitions
export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Border colors
  border: string;
  borderHover: string;
  borderFocus: string;

  // Accent colors
  primary: string;
  primaryHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;

  // Code editor colors
  codeBackground: string;
  codeText: string;
  codeComment: string;
  codeKeyword: string;
  codeString: string;
  codeNumber: string;
  codeFunction: string;

  // Syntax highlighting
  syntaxBackground: string;
  syntaxBorder: string;
}

// Industry-standard color schemes
const lightTheme: ThemeColors = {
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f6f8fa',
  backgroundTertiary: '#f0f3f6',
  backgroundElevated: '#ffffff',

  // Text
  text: '#24292f',
  textSecondary: '#57606a',
  textTertiary: '#6e7781',
  textInverse: '#ffffff',

  // Borders
  border: '#d0d7de',
  borderHover: '#8b949e',
  borderFocus: '#0969da',

  // Accents
  primary: '#0969da',
  primaryHover: '#0860ca',
  success: '#1a7f37',
  warning: '#9a6700',
  error: '#cf222e',
  info: '#0969da',

  // Code colors (GitHub Light)
  codeBackground: '#f6f8fa',
  codeText: '#24292f',
  codeComment: '#6e7781',
  codeKeyword: '#cf222e',
  codeString: '#0a3069',
  codeNumber: '#0550ae',
  codeFunction: '#8250df',

  // Syntax
  syntaxBackground: '#f6f8fa',
  syntaxBorder: '#d1d9e0',
};

const darkTheme: ThemeColors = {
  // Backgrounds (VS Code / GitHub Dark inspired)
  background: '#0d1117',
  backgroundSecondary: '#161b22',
  backgroundTertiary: '#21262d',
  backgroundElevated: '#1c2128',

  // Text
  text: '#c9d1d9',
  textSecondary: '#8b949e',
  textTertiary: '#6e7681',
  textInverse: '#0d1117',

  // Borders
  border: '#30363d',
  borderHover: '#6e7681',
  borderFocus: '#58a6ff',

  // Accents
  primary: '#58a6ff',
  primaryHover: '#79c0ff',
  success: '#3fb950',
  warning: '#d29922',
  error: '#f85149',
  info: '#58a6ff',

  // Code colors (GitHub Dark)
  codeBackground: '#161b22',
  codeText: '#c9d1d9',
  codeComment: '#8b949e',
  codeKeyword: '#ff7b72',
  codeString: '#a5d6ff',
  codeNumber: '#79c0ff',
  codeFunction: '#d2a8ff',

  // Syntax
  syntaxBackground: '#161b22',
  syntaxBorder: '#30363d',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize from localStorage or system preference
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
    return 'auto'; // Default to auto
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Determine if we should use dark theme
  const isDark = mode === 'dark' || (mode === 'auto' && systemPrefersDark);
  const colors = isDark ? darkTheme : lightTheme;

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Apply class for global styles (both 'dark' for Tailwind and 'dark-theme' for custom CSS)
    if (isDark) {
      root.classList.add('dark', 'dark-theme');
      root.classList.remove('light-theme');
      root.style.backgroundColor = colors.background;
      root.style.color = colors.text;
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark', 'dark-theme');
      root.style.backgroundColor = colors.background;
      root.style.color = colors.text;
    }
  }, [colors, isDark]);

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(current => {
      // Cycle: auto -> light -> dark -> auto
      if (current === 'auto') return 'light';
      if (current === 'light') return 'dark';
      return 'auto';
    });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const contextValue: ThemeContextType = {
    mode,
    colors,
    isDark,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility function to get theme-aware styles
export function getThemeStyles(isDark: boolean) {
  const theme = isDark ? darkTheme : lightTheme;

  return {
    container: {
      backgroundColor: theme.background,
      color: theme.text,
      borderColor: theme.border,
    },
    card: {
      backgroundColor: theme.backgroundSecondary,
      borderColor: theme.border,
      borderRadius: '8px',
      padding: '16px',
    },
    button: {
      primary: {
        backgroundColor: theme.primary,
        color: theme.textInverse,
        border: 'none',
        '&:hover': {
          backgroundColor: theme.primaryHover,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.primary,
        border: `1px solid ${theme.border}`,
        '&:hover': {
          borderColor: theme.borderHover,
          backgroundColor: theme.backgroundSecondary,
        },
      },
    },
    codeEditor: {
      backgroundColor: theme.codeBackground,
      color: theme.codeText,
      borderColor: theme.border,
      '.comment': { color: theme.codeComment },
      '.keyword': { color: theme.codeKeyword },
      '.string': { color: theme.codeString },
      '.number': { color: theme.codeNumber },
      '.function': { color: theme.codeFunction },
    },
  };
}