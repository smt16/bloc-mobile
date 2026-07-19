import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import type { SemanticColors } from './palettes';
import { useTheme } from './ThemeProvider';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Recreate StyleSheet when the active palette changes (light ↔ dark).
 */
export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (colors: SemanticColors) => T,
): T {
  const { colors } = useTheme();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
