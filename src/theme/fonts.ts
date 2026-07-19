/**
 * Loaded via `useFonts` in the root layout.
 * Display = condensed skate-mag headline; mono = xerox/zine meta.
 */
export const fonts = {
  display: 'BebasNeue_400Regular',
  mono: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',
} as const;

export type FontFamily = (typeof fonts)[keyof typeof fonts];
