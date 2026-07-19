import { colors } from '../theme';

export const STYLE_TAG_OPTIONS = [
  'Crimpy',
  'Slab',
  'Overhang',
  'Dyno',
  'Compression',
  'Technical',
  'Power',
  'Volume',
] as const;

export const GRADE_OPTIONS = [
  'VB',
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
] as const;

export const AVATAR_COLORS = [
  colors.accent,
  '#FF3D77',
  colors.cyan,
  colors.purple,
  colors.success,
  '#F2C94C',
] as const;
