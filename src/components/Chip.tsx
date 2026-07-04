import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  label: string;
  icon?: IconName;
  active?: boolean;
  tone?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Pill-shaped tag / filter chip. */
export const Chip: React.FC<Props> = ({
  label,
  icon,
  active = false,
  tone,
  onPress,
  style,
}) => {
  const accent = tone ?? colors.accent;
  const content = (
    <View
      style={[
        styles.chip,
        active && { backgroundColor: accent, borderColor: accent },
        style,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={14} color={active ? colors.bg : colors.textMuted} />
      ) : null}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
        {content}
      </Pressable>
    );
  }
  return content;
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.bg,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
