import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  title?: string;
  variant?: 'back' | 'close';
  right?: React.ReactNode;
};

export const NavHeader: React.FC<Props> = ({ title, variant = 'back', right }) => {
  const router = useRouter();
  const icon: IconName = variant === 'close' ? 'close' : 'chevron-back';

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)'))}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Icon name={icon} size={22} color={colors.text} />
      </Pressable>
      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
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
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
  },
  right: {
    minWidth: 42,
    alignItems: 'flex-end',
  },
});
