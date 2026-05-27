/**
 * Bloc design tokens.
 *
 * Minimal + modern. Dark by default with a saturated chalk-orange accent that
 * nods to climbing chalk dust + warm holds.
 */
export const colors = {
  bg: '#0B0B0F',
  bgElevated: '#15151C',
  surface: '#1B1B24',
  surfaceMuted: '#22222C',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',

  text: '#F5F5F7',
  textMuted: 'rgba(245, 245, 247, 0.64)',
  textSubtle: 'rgba(245, 245, 247, 0.42)',

  accent: '#FF6B3D',
  accentMuted: 'rgba(255, 107, 61, 0.16)',
  accentText: '#0B0B0F',

  success: '#3DDC97',
  warning: '#F2C94C',
  danger: '#FF5A5F',
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

export const theme = { colors, spacing, radius, typography };
export type Theme = typeof theme;
