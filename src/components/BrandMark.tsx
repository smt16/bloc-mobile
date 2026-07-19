import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { fonts, shadows } from '../theme';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bloc brand mark — angular chalk-block stencil.
 * Hard edges + offset shadow = sticker slapped on a zine cover.
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
        style={[
          {
            width: dimensions.mark,
            height: dimensions.mark,
            borderRadius: 2,
            borderWidth: 2,
            borderColor: '#0A0A0A',
          },
          shadows.card,
        ]}
      >
        <View
          className="bg-bg"
          style={{
            width: dimensions.mark * 0.42,
            height: dimensions.mark * 0.28,
            borderRadius: 1,
            transform: [{ rotate: '-8deg' }],
          }}
        />
      </View>
      {showWordmark ? (
        <Text
          className="text-text uppercase"
          style={{
            fontFamily: fonts.display,
            fontSize: dimensions.text,
            letterSpacing: 2,
            lineHeight: dimensions.text,
          }}
        >
          bloc
        </Text>
      ) : null}
    </View>
  );
};

const sizeMap = {
  sm: { mark: 24, text: 22 },
  md: { mark: 36, text: 34 },
  lg: { mark: 56, text: 52 },
};
