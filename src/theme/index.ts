/**
 * Bloc design tokens — dirtbag / 90s skate zine direction.
 *
 * Brand accent is traffic-cone `orange`. Surfaces follow newsprint (light)
 * or asphalt (dark). Prefer NativeWind utilities for static styling;
 * use `useTheme().colors` for dynamic/runtime styles.
 */

import { darkColors, lightColors, type SemanticColors } from './palettes';
import { orange } from './orange';
import { fonts } from './fonts';

export { orange };
export { fonts };
export { lightColors, darkColors };
export type { SemanticColors };

/**
 * @deprecated Prefer `useTheme().colors` so light/dark updates apply.
 * Static fallback matches the dark palette for modules evaluated at import time.
 */
export const colors: SemanticColors = darkColors;

/**
 * Gradient stops — no soft lifestyle violet. Hazard tape + asphalt.
 */
export const gradients = {
  brand: [orange.main, orange[600], '#1A0800'] as const,
  ember: [orange[400], orange.main] as const,
  aurora: [orange.main, '#C8FF00'] as const,
  send: ['#3DDC97', '#00C2B8'] as const,
  surface: [darkColors.surface, darkColors.bgElevated] as const,
  fade: ['rgba(10,10,10,0)', darkColors.bg] as const,
};

/**
 * Climbing grade → color scale (V-scale). Lets grade chips read at a glance.
 */
export const gradeColors: Record<string, string> = {
  VB: '#7AA2FF',
  V0: '#3DDC97',
  V1: '#3DDC97',
  V2: '#00C2B8',
  V3: '#FFCC00',
  V4: orange[400],
  V5: orange.main,
  V6: '#FF3B4A',
  V7: '#FF2D6A',
  V8: '#C8FF00',
  V9: '#B8F000',
  V10: '#9AE600',
};

export const gradeColor = (grade: string): string =>
  gradeColors[grade.toUpperCase()] ?? orange.main;

/** Hard-offset print shadows — xerox / sticker, not soft glow. */
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.85,
    shadowRadius: 0,
    elevation: 4,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  glow: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
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

/** Sticker corners — almost hard-edged, never soft pill. */
export const radius = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  pill: 4,
};

export const typography = {
  display: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '400' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '400' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '400' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
  },
};

export const theme = {
  orange,
  fonts,
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
