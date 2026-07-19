import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { gradients, useTheme } from '../theme';

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
  track,
  style,
}) => {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, progress));
  const trackColor = track ?? colors.surfaceMuted;

  return (
    <View
      className="w-full overflow-hidden rounded-pill"
      style={[
        { height, borderRadius: height / 2, backgroundColor: trackColor },
        style,
      ]}
    >
      <LinearGradient
        colors={colorsOverride ? [...colorsOverride] : [...gradients.ember]}
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
