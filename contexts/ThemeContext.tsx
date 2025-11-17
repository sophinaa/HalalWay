import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeColors = {
  background: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  accent: string;
  accentContrast: string;
  tagBackground: string;
  tagText: string;
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
};

type ThemeContextValue = {
  themeMode: ThemeMode;
  theme: Exclude<ColorSchemeName, null>;
  setThemeMode: (mode: ThemeMode) => void;
  themeColors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themePalettes: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#ffffff',
    card: '#f8fafc',
    border: '#e5e7eb',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    muted: '#94a3b8',
    accent: '#3a5974',
    accentContrast: '#ffffff',
    tagBackground: '#e5e7eb',
    tagText: '#111827',
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputPlaceholder: '#64748b',
  },
  dark: {
    background: '#121212',
    card: '#17191b',
    border: '#2c2e30',
    textPrimary: '#ffffff',
    textSecondary: '#a5b1bf',
    muted: '#8b8b8b',
    accent: '#3a5974',
    accentContrast: '#ffffff',
    tagBackground: '#2c2e30',
    tagText: '#cbd5f5',
    inputBackground: '#1f1f1f',
    inputBorder: '#434446',
    inputPlaceholder: '#8b8b8b',
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const theme = useMemo<Exclude<ColorSchemeName, null>>(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const themeColors = themePalettes[theme];

  const value = useMemo(
    () => ({ themeMode, theme, setThemeMode, themeColors }),
    [themeMode, theme, themeColors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemePreference = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePreference must be used within ThemeProvider');
  }
  return context;
};
