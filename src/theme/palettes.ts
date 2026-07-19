import { orange } from './orange';

export type SemanticColors = {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentMuted: string;
  accentText: string;
  purple: string;
  purpleMuted: string;
  cyan: string;
  cyanMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  danger: string;
};

/** Warm light surfaces paired with the orange brand scale. */
export const lightColors: SemanticColors = {
  bg: '#FFFBF5',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F5EDE3',
  surfaceHover: '#EDE3D6',
  border: 'rgba(34, 21, 2, 0.08)',
  borderStrong: 'rgba(34, 21, 2, 0.16)',

  text: orange[950],
  textMuted: 'rgba(34, 21, 2, 0.64)',
  textSubtle: 'rgba(34, 21, 2, 0.42)',

  accent: orange.main,
  accentMuted: orange.muted,
  accentText: '#FFFFFF',

  purple: '#8B5CF6',
  purpleMuted: 'rgba(139, 92, 246, 0.16)',
  cyan: '#0D9488',
  cyanMuted: 'rgba(13, 148, 136, 0.16)',

  success: '#159F6B',
  successMuted: 'rgba(21, 159, 107, 0.16)',
  warning: '#C27803',
  danger: '#E11D48',
};

/** Dark surfaces with orange-main accents. */
export const darkColors: SemanticColors = {
  bg: '#0C0A08',
  bgElevated: '#161310',
  surface: '#1C1814',
  surfaceMuted: '#26201A',
  surfaceHover: '#322A22',
  border: 'rgba(254, 244, 231, 0.08)',
  borderStrong: 'rgba(254, 244, 231, 0.16)',

  text: orange[50],
  textMuted: 'rgba(254, 244, 231, 0.64)',
  textSubtle: 'rgba(254, 244, 231, 0.42)',

  accent: orange.main,
  accentMuted: orange.muted,
  accentText: orange[950],

  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.16)',
  cyan: '#2DD4BF',
  cyanMuted: 'rgba(45, 212, 191, 0.16)',

  success: '#34D399',
  successMuted: 'rgba(52, 211, 153, 0.16)',
  warning: '#FBBF24',
  danger: '#FB7185',
};

export const paletteFor = (scheme: 'light' | 'dark'): SemanticColors =>
  scheme === 'light' ? lightColors : darkColors;
