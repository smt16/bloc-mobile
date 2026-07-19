import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { typography } from '../theme';

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
    <View className="flex-row items-center gap-md" style={style}>
      <View
        className="items-center justify-center bg-accent"
        style={{
          width: dimensions.mark,
          height: dimensions.mark,
          borderRadius: dimensions.mark / 4,
        }}
      >
        <View
          className="bg-bg"
          style={{
            width: dimensions.mark * 0.45,
            height: dimensions.mark * 0.45,
            borderRadius: dimensions.mark * 0.225,
          }}
        />
      </View>
      {showWordmark ? (
        <Text
          className="text-text"
          style={{
            fontSize: dimensions.text,
            fontWeight: typography.display.fontWeight,
            letterSpacing: -0.5,
          }}
        >
          bloc
        </Text>
      ) : null}
    </View>
  );
};

const sizeMap = {
  sm: { mark: 24, text: 18 },
  md: { mark: 36, text: 26 },
  lg: { mark: 56, text: 40 },
};
