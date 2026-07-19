import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { gradients, typography, useTheme, type SemanticColors } from '../theme';

type Props = {
  initials?: string;
  color?: string;
  uri?: string;
  size?: number;
  ring?: boolean;
  gradientRing?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular climber avatar. Falls back to tinted initials when no photo exists,
 * with an optional gradient "story ring" used in the feed + profile hero.
 */
export const Avatar: React.FC<Props> = ({
  initials = '?',
  color,
  uri,
  size = 44,
  ring = false,
  gradientRing = false,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fill = color ?? colors.accent;

  const inner = (
    <View
      style={[
        styles.inner,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: uri ? colors.surface : fill,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
      )}
    </View>
  );

  if (gradientRing) {
    return (
      <LinearGradient
        colors={[...gradients.brand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.ringWrap, { borderRadius: (size + 8) / 2, padding: 2.5 }, style]}
      >
        <View style={[styles.ringGap, { borderRadius: (size + 3) / 2, padding: 2 }]}>
          {inner}
        </View>
      </LinearGradient>
    );
  }

  if (ring) {
    return (
      <View
        style={[
          styles.solidRing,
          { borderRadius: (size + 8) / 2, padding: 2.5 },
          style,
        ]}
      >
        {inner}
      </View>
    );
  }

  return <View style={style}>{inner}</View>;
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    inner: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initials: {
      ...typography.bodyStrong,
      color: colors.bg,
      fontWeight: '800',
    },
    ringWrap: {
      alignSelf: 'flex-start',
    },
    ringGap: {
      backgroundColor: colors.bg,
    },
    solidRing: {
      alignSelf: 'flex-start',
      backgroundColor: colors.bg,
      borderWidth: 2,
      borderColor: colors.accent,
    },
  });
