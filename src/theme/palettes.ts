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

/**
 * Light = newsprint / xerox stock.
 * Ink-black type, dirtier paper, harder borders — not soft lifestyle cream.
 */
export const lightColors: SemanticColors = {
  bg: '#E8E2D4',
  bgElevated: '#F0EBE0',
  surface: '#F4EFE4',
  surfaceMuted: '#DDD6C6',
  surfaceHover: '#D0C8B5',
  border: 'rgba(10, 10, 10, 0.18)',
  borderStrong: 'rgba(10, 10, 10, 0.42)',

  text: '#0A0A0A',
  textMuted: 'rgba(10, 10, 10, 0.62)',
  textSubtle: 'rgba(10, 10, 10, 0.4)',

  accent: orange.main,
  accentMuted: orange.muted,
  accentText: '#0A0A0A',

  // Acid lime — skate sticker / hazard accent (key kept as `purple` for API stability)
  purple: '#B8F000',
  purpleMuted: 'rgba(184, 240, 0, 0.22)',
  cyan: '#00C2B8',
  cyanMuted: 'rgba(0, 194, 184, 0.18)',

  success: '#1A9E5C',
  successMuted: 'rgba(26, 158, 92, 0.18)',
  warning: '#E6A800',
  danger: '#E11D2E',
};

/**
 * Dark = asphalt / night session.
 * True black, chalk-white type, traffic-cone accent.
 */
export const darkColors: SemanticColors = {
  bg: '#0A0A0A',
  bgElevated: '#111111',
  surface: '#161616',
  surfaceMuted: '#1F1F1F',
  surfaceHover: '#2A2A2A',
  border: 'rgba(242, 240, 232, 0.14)',
  borderStrong: 'rgba(242, 240, 232, 0.32)',

  text: '#F2F0E8',
  textMuted: 'rgba(242, 240, 232, 0.64)',
  textSubtle: 'rgba(242, 240, 232, 0.4)',

  accent: orange.main,
  accentMuted: orange.muted,
  accentText: '#0A0A0A',

  purple: '#C8FF00',
  purpleMuted: 'rgba(200, 255, 0, 0.18)',
  cyan: '#2EE6D6',
  cyanMuted: 'rgba(46, 230, 214, 0.16)',

  success: '#3DDC97',
  successMuted: 'rgba(61, 220, 151, 0.16)',
  warning: '#FFCC00',
  danger: '#FF3B4A',
};

export const paletteFor = (scheme: 'light' | 'dark'): SemanticColors =>
  scheme === 'light' ? lightColors : darkColors;
