import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  name: IconName;
  onPress?: () => void;
  size?: number;
  color?: string;
  badge?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const IconButton: React.FC<Props> = ({
  name,
  onPress,
  size = 20,
  color = colors.text,
  badge = false,
  style,
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
  >
    <Icon name={name} size={size} color={color} />
    {badge ? <View style={styles.badge} /> : null}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
