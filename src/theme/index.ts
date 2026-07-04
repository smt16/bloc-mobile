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
  surfaceHover: '#2A2A36',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',

  text: '#F5F5F7',
  textMuted: 'rgba(245, 245, 247, 0.64)',
  textSubtle: 'rgba(245, 245, 247, 0.42)',

  accent: '#FF6B3D',
  accentMuted: 'rgba(255, 107, 61, 0.16)',
  accentText: '#0B0B0F',

  purple: '#8B5CF6',
  purpleMuted: 'rgba(139, 92, 246, 0.16)',
  cyan: '#38E1D6',
  cyanMuted: 'rgba(56, 225, 214, 0.16)',

  success: '#3DDC97',
  successMuted: 'rgba(61, 220, 151, 0.16)',
  warning: '#F2C94C',
  danger: '#FF5A5F',
};

/**
 * Gradient stops used across hero moments + progression surfaces.
 * The signature Bloc gradient runs chalk-orange → magenta → violet.
 */
export const gradients = {
  brand: ['#FF6B3D', '#FF3D77', '#8B5CF6'] as const,
  ember: ['#FF8A3D', '#FF3D5A'] as const,
  aurora: ['#38E1D6', '#8B5CF6'] as const,
  send: ['#3DDC97', '#38E1D6'] as const,
  surface: ['#1B1B24', '#14141B'] as const,
  fade: ['rgba(11,11,15,0)', '#0B0B0F'] as const,
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
  V4: '#FF9F45',
  V5: '#FF6B3D',
  V6: '#FF3D5A',
  V7: '#FF3D77',
  V8: '#C13DFF',
  V9: '#8B5CF6',
  V10: '#6C5CE7',
};

export const gradeColor = (grade: string): string =>
  gradeColors[grade.toUpperCase()] ?? colors.accent;

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
    shadowColor: '#FF6B3D',
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
  colors,
  spacing,
  radius,
  typography,
  gradients,
  gradeColors,
  shadows,
};
export type Theme = typeof theme;
