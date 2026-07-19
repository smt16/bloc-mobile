import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { typography, useTheme, type SemanticColors } from '../theme';

type Props = {
  colors: string[];
  size?: number;
  max?: number;
  extra?: number;
};

/** Overlapping avatar bubbles used for crews / route sends. */
export const AvatarStack: React.FC<Props> = ({
  colors: bubbleColors,
  size = 28,
  max = 4,
  extra,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const shown = bubbleColors.slice(0, max);
  const overflow = extra ?? Math.max(0, bubbleColors.length - max);

  return (
    <View style={styles.row}>
      {shown.map((color, i) => (
        <View
          key={i}
          style={[
            styles.bubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              marginLeft: i === 0 ? 0 : -size * 0.32,
              zIndex: shown.length - i,
            },
          ]}
        />
      ))}
      {overflow > 0 ? (
        <View
          style={[
            styles.bubble,
            styles.overflow,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.32,
            },
          ]}
        >
          <Text style={[styles.overflowText, { fontSize: size * 0.36 }]}>
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bubble: {
      borderWidth: 2,
      borderColor: colors.bg,
    },
    overflow: {
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overflowText: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '700',
    },
  });
