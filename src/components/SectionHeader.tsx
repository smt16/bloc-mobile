import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, action, onAction }) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={styles.action}>{action}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  action: {
    ...typography.caption,
    color: colors.accent,
  },
});
