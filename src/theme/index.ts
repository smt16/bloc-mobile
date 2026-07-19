/**
 * Bloc design tokens.
 *
 * Brand accent is the generic `orange` scale (`orange.main` = 500).
 * Light/dark semantic surfaces live in `palettes.ts` and are applied via
 * `ThemeProvider` (device appearance by default).
 *
 * Prefer NativeWind utilities (`bg-bg`, `text-accent`, `bg-orange-main`) for
 * static styling. Use `useTheme().colors` for dynamic/runtime styles.
 */

import { darkColors, lightColors, type SemanticColors } from './palettes';
import { orange } from './orange';

export { orange };
export { lightColors, darkColors };
export type { SemanticColors };

/**
 * @deprecated Prefer `useTheme().colors` so light/dark updates apply.
 * Static fallback matches the dark palette for modules evaluated at import time.
 */
export const colors: SemanticColors = darkColors;

/**
 * Gradient stops used across hero moments + progression surfaces.
 * Brand gradient leans on orange-main → deep → violet.
 */
export const gradients = {
  brand: [orange.main, orange[600], '#8B5CF6'] as const,
  ember: [orange[400], orange[600]] as const,
  aurora: ['#38E1D6', '#8B5CF6'] as const,
  send: ['#3DDC97', '#38E1D6'] as const,
  surface: [darkColors.surface, darkColors.bgElevated] as const,
  fade: ['rgba(12,10,8,0)', darkColors.bg] as const,
};

/**
 * Climbing grade → color scale (V-scale). Lets grade chips read at a glance.
 */
export const gradeColors: Record<string, string> = {
  VB: '#7AA2FF',
  V0: '#3DDC97',
  V1: '#3DDC97',
  V2: '#38E1D6',
  V3: '#F2C94C',
  V4: orange[400],
  V5: orange.main,
  V6: '#FF3D5A',
  V7: '#FF3D77',
  V8: '#C13DFF',
  V9: '#8B5CF6',
  V10: '#6C5CE7',
};

export const gradeColor = (grade: string): string =>
  gradeColors[grade.toUpperCase()] ?? orange.main;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 16,
  },
  glow: {
    shadowColor: orange.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 72,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
};

export const theme = {
  orange,
  colors,
  spacing,
  radius,
  typography,
  gradients,
  gradeColors,
  shadows,
};
export type Theme = typeof theme;

export { cn } from './cn';
export { ThemeProvider, useTheme, useThemeColors } from './ThemeProvider';
export { useThemedStyles } from './useThemedStyles';
