import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bloc brand mark — a stacked geometric form evoking a climbing hold + chalk.
 * Built from pure RN <View> so it works without any SVG dependency.
 */
export const BrandMark: React.FC<Props> = ({
  size = 'md',
  showWordmark = true,
  style,
}) => {
  const dimensions = sizeMap[size];

  return (
    <View style={[styles.row, style]}>
      <View
        style={[
          styles.mark,
          {
            width: dimensions.mark,
            height: dimensions.mark,
            borderRadius: dimensions.mark / 4,
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: dimensions.mark * 0.45,
              height: dimensions.mark * 0.45,
              borderRadius: dimensions.mark * 0.225,
            },
          ]}
        />
      </View>
      {showWordmark ? (
        <Text style={[styles.wordmark, { fontSize: dimensions.text }]}>bloc</Text>
      ) : null}
    </View>
  );
};

const sizeMap = {
  sm: { mark: 24, text: 18 },
  md: { mark: 36, text: 26 },
  lg: { mark: 56, text: 40 },
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    backgroundColor: colors.bg,
  },
  wordmark: {
    color: colors.text,
    fontWeight: typography.display.fontWeight,
    letterSpacing: -0.5,
  },
});
