import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { View } from 'react-native';
import { colorScheme as nwColorScheme, useColorScheme, vars } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import { darkColors, lightColors, type SemanticColors } from './palettes';

type ColorSchemeName = 'light' | 'dark';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  isDark: boolean;
  colors: SemanticColors;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const toCssVars = (c: SemanticColors) =>
  vars({
    '--color-bg': c.bg,
    '--color-bg-elevated': c.bgElevated,
    '--color-surface': c.surface,
    '--color-surface-muted': c.surfaceMuted,
    '--color-surface-hover': c.surfaceHover,
    '--color-border': c.border,
    '--color-border-strong': c.borderStrong,
    '--color-text': c.text,
    '--color-text-muted': c.textMuted,
    '--color-text-subtle': c.textSubtle,
    '--color-accent': c.accent,
    '--color-accent-muted': c.accentMuted,
    '--color-accent-text': c.accentText,
    '--color-purple': c.purple,
    '--color-purple-muted': c.purpleMuted,
    '--color-cyan': c.cyan,
    '--color-cyan-muted': c.cyanMuted,
    '--color-success': c.success,
    '--color-success-muted': c.successMuted,
    '--color-warning': c.warning,
    '--color-danger': c.danger,
  });

const lightVars = toCssVars(lightColors);
const darkVars = toCssVars(darkColors);

type Props = {
  children: ReactNode;
};

/**
 * Follows the device appearance by default (`system`).
 * Semantic CSS variables + React context keep NativeWind classNames and
 * imperative StyleSheet colors in sync.
 */
export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    nwColorScheme.set('system');
  }, []);

  const resolved: ColorSchemeName = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = resolved === 'dark' ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme: resolved,
      isDark: resolved === 'dark',
      colors,
      setColorScheme,
      toggleColorScheme,
    }),
    [resolved, colors, setColorScheme, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View
        style={resolved === 'dark' ? darkVars : lightVars}
        className="flex-1 bg-bg"
      >
        <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};

/** Safe read for non-component modules; prefers dark until provider mounts. */
export const useThemeColors = (): SemanticColors => useTheme().colors;
