import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, Text, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from './AuthContext';

type ThemeMode = 'system' | 'light' | 'dark';
type ThemeName = 'default' | 'autumn' | 'blush' | 'forest' | 'ocean' | 'amethyst';
type AccessibilityMode = 'standard' | 'accessible';

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
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  textScale: number;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themePalettes: Record<ThemeName, Record<'light' | 'dark', ThemeColors>> = {
  default: {
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
  },
  autumn: {
    light: {
      background: '#ede6d8',
      card: '#d8b7a0',
      border: '#8a9a63',
      textPrimary: '#3a1e2d',
      textSecondary: '#5c1f28',
      muted: '#8a9a63',
      accent: '#5c1f28',
      accentContrast: '#ede6d8',
      tagBackground: '#ede6d8',
      tagText: '#3a1e2d',
      inputBackground: '#ede6d8',
      inputBorder: '#8a9a63',
      inputPlaceholder: '#8a9a63',
    },
    dark: {
      background: '#3a1e2d',
      card: '#5c1f28',
      border: '#8a9a63',
      textPrimary: '#ede6d8',
      textSecondary: '#d8b7a0',
      muted: '#8a9a63',
      accent: '#d8b7a0',
      accentContrast: '#3a1e2d',
      tagBackground: '#5c1f28',
      tagText: '#ede6d8',
      inputBackground: '#3a1e2d',
      inputBorder: '#8a9a63',
      inputPlaceholder: '#d8b7a0',
    },
  },
  blush: {
    light: {
      background: '#fcf4fa',
      card: '#fff7fa',
      border: '#bc2c96',
      textPrimary: '#aa219d',
      textSecondary: '#bc2c96',
      muted: '#e1208f',
      accent: '#ff007f',
      accentContrast: '#fcf4fa',
      tagBackground: '#fce8eb',
      tagText: '#aa219d',
      inputBackground: '#fff7fa',
      inputBorder: '#bc2c96',
      inputPlaceholder: '#bc2c96',
    },
    dark: {
      background: '#2b0f1c',
      card: '#3a1626',
      border: '#bc2c96',
      textPrimary: '#fcf4fa',
      textSecondary: '#e1208f',
      muted: '#bc2c96',
      accent: '#ff007f',
      accentContrast: '#fcf4fa',
      tagBackground: '#3a1626',
      tagText: '#ff007f',
      inputBackground: '#3a1626',
      inputBorder: '#bc2c96',
      inputPlaceholder: '#e1208f',
    },
  },
  forest: {
    light: {
      background: '#d9ead3',
      card: '#b1e082',
      border: '#99ce63',
      textPrimary: '#243b2c',
      textSecondary: '#4b634b',
      muted: '#7fa45a',
      accent: '#99ce63',
      accentContrast: '#0f1a12',
      tagBackground: '#b1e082',
      tagText: '#243b2c',
      inputBackground: '#d9ead3',
      inputBorder: '#99ce63',
      inputPlaceholder: '#7fa45a',
    },
    dark: {
      background: '#243b2c',
      card: '#4b634b',
      border: '#627c5c',
      textPrimary: '#d3f2b8',
      textSecondary: '#a8c391',
      muted: '#7fa45a',
      accent: '#a8c391',
      accentContrast: '#243b2c',
      tagBackground: '#4b634b',
      tagText: '#d3f2b8',
      inputBackground: '#4b634b',
      inputBorder: '#627c5c',
      inputPlaceholder: '#a8c391',
    },
  },
  ocean: {
    light: {
      background: '#cfe2f3',
      card: '#9fc5e8',
      border: '#79b6cb',
      textPrimary: '#153462',
      textSecondary: '#2f5388',
      muted: '#5897ac',
      accent: '#2f5388',
      accentContrast: '#c8f1ff',
      tagBackground: '#94d4e9',
      tagText: '#153462',
      inputBackground: '#cfe2f3',
      inputBorder: '#79b6cb',
      inputPlaceholder: '#5897ac',
    },
    dark: {
      background: '#0f1f3a',
      card: '#153462',
      border: '#2f5388',
      textPrimary: '#c8f1ff',
      textSecondary: '#94d4e9',
      muted: '#79b6cb',
      accent: '#5897ac',
      accentContrast: '#0f1f3a',
      tagBackground: '#2f5388',
      tagText: '#c8f1ff',
      inputBackground: '#153462',
      inputBorder: '#2f5388',
      inputPlaceholder: '#94d4e9',
    },
  },
  amethyst: {
    light: {
      background: '#d9d2e9',
      card: '#8e7cc3',
      border: '#7b2cbf',
      textPrimary: '#10002b',
      textSecondary: '#3c096c',
      muted: '#5a189a',
      accent: '#9d4edd',
      accentContrast: '#fdfbff',
      tagBackground: '#c77dff',
      tagText: '#10002b',
      inputBackground: '#d9d2e9',
      inputBorder: '#7b2cbf',
      inputPlaceholder: '#5a189a',
    },
    dark: {
      background: '#10002b',
      card: '#240046',
      border: '#5a189a',
      textPrimary: '#e0aaff',
      textSecondary: '#c77dff',
      muted: '#9d4edd',
      accent: '#7b2cbf',
      accentContrast: '#0b001f',
      tagBackground: '#240046',
      tagText: '#e0aaff',
      inputBackground: '#240046',
      inputBorder: '#5a189a',
      inputPlaceholder: '#c77dff',
    },
  },
};

const accessiblePalette: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    border: '#000000',
    textPrimary: '#000000',
    textSecondary: '#1f2937',
    muted: '#111827',
    accent: '#ffcc00',
    accentContrast: '#000000',
    tagBackground: '#ffffff',
    tagText: '#000000',
    inputBackground: '#ffffff',
    inputBorder: '#000000',
    inputPlaceholder: '#4b5563',
  },
  dark: {
    background: '#000000',
    card: '#111111',
    border: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#e5e7eb',
    muted: '#c7c7c7',
    accent: '#ffcc00',
    accentContrast: '#000000',
    tagBackground: '#111111',
    tagText: '#ffffff',
    inputBackground: '#111111',
    inputBorder: '#ffffff',
    inputPlaceholder: '#c7c7c7',
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const userId = auth?.user?.uid;
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [themeName, setThemeName] = useState<ThemeName>('default');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('standard');
  const storageKey = userId ? `theme:${userId}` : 'theme:guest';

  useEffect(() => {
    let isMounted = true;
    const loadPrefs = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed.mode === 'light' || parsed.mode === 'dark' || parsed.mode === 'system') {
            setThemeMode(parsed.mode);
          }
          if (
            parsed.themeName === 'default' ||
            parsed.themeName === 'autumn' ||
            parsed.themeName === 'blush' ||
            parsed.themeName === 'forest' ||
            parsed.themeName === 'ocean' ||
            parsed.themeName === 'amethyst'
          ) {
            setThemeName(parsed.themeName);
          }
          if (parsed.accessibilityMode === 'accessible' || parsed.accessibilityMode === 'standard') {
            setAccessibilityMode(parsed.accessibilityMode);
          }
        }
      } catch {
        // ignore and keep defaults
      }
    };
    loadPrefs();
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  useEffect(() => {
    const persist = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify({ mode: themeMode, themeName, accessibilityMode }));
      } catch {
        // best effort only
      }
    };
    persist();
  }, [themeMode, themeName, accessibilityMode, storageKey]);

  const theme = useMemo<Exclude<ColorSchemeName, null>>(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const themeColors =
    accessibilityMode === 'accessible' ? accessiblePalette[theme] : themePalettes[themeName][theme];
  const textScale = accessibilityMode === 'accessible' ? 1.1 : 1;

  useEffect(() => {
    if (accessibilityMode === 'accessible') {
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.allowFontScaling = true;
      Text.defaultProps.maxFontSizeMultiplier = 1.3;
    } else if (Text.defaultProps) {
      Text.defaultProps.allowFontScaling = undefined;
      Text.defaultProps.maxFontSizeMultiplier = undefined;
    }
  }, [accessibilityMode]);

  const value = useMemo(
    () => ({
      themeMode,
      theme,
      setThemeMode,
      themeColors,
      themeName,
      setThemeName,
      accessibilityMode,
      setAccessibilityMode,
      textScale,
    }),
    [themeMode, theme, themeColors, themeName, accessibilityMode, textScale],
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
