import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients, radius } from '../theme';

type Props = {
  /** 0..1 */
  progress: number;
  height?: number;
  colorsOverride?: readonly [string, string, ...string[]];
  track?: string;
  style?: StyleProp<ViewStyle>;
};

export const ProgressBar: React.FC<Props> = ({
  progress,
  height = 8,
  colorsOverride,
  track = colors.surfaceMuted,
  style,
}) => {
  const pct = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: track },
        style,
      ]}
    >
      <LinearGradient
        colors={colorsOverride ?? gradients.ember}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${pct * 100}%`,
          height,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
});
