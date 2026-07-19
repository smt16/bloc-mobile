import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ReactionType } from '../api/types';
import { radius, spacing, typography, useTheme, type SemanticColors } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  reactions: { fire: number; strong: number; clap: number };
  comments: number;
  reactedByMe?: ReactionType | null;
  onReact?: (type: ReactionType) => void;
};

/** Climbing-native encouragement bar — fire / strong / respect + comments. */
export const ReactionBar: React.FC<Props> = ({
  reactions,
  comments,
  reactedByMe,
  onReact,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const reactionMeta: {
    key: ReactionType;
    icon: IconName;
    color: string;
    label: string;
  }[] = [
    { key: 'fire', icon: 'flame', color: colors.accent, label: 'Fire' },
    { key: 'strong', icon: 'barbell', color: colors.purple, label: 'Strong' },
    { key: 'clap', icon: 'hand-left', color: colors.cyan, label: 'Respect' },
  ];

  const [mine, setMine] = useState<ReactionType | undefined>(
    reactedByMe ?? undefined,
  );

  useEffect(() => {
    setMine(reactedByMe ?? undefined);
  }, [reactedByMe]);

  const countFor = (key: ReactionType) => {
    const base = reactions[key];
    const original = reactedByMe ?? undefined;
    if (original === key && mine !== key) return base - 1;
    if (original !== key && mine === key) return base + 1;
    return base;
  };

  return (
    <View style={styles.row}>
      {reactionMeta.map((r) => {
        const active = mine === r.key;
        return (
          <Pressable
            key={r.key}
            onPress={() => {
              setMine(active ? undefined : r.key);
              onReact?.(r.key);
            }}
            style={[
              styles.pill,
              active && { backgroundColor: `${r.color}26`, borderColor: `${r.color}55` },
            ]}
          >
            <Icon name={r.icon} size={15} color={active ? r.color : colors.textMuted} />
            <Text style={[styles.count, active && { color: r.color }]}>
              {countFor(r.key)}
            </Text>
          </Pressable>
        );
      })}
      <View style={styles.spacer} />
      <View style={styles.pill}>
        <Icon name="chatbubble-outline" size={15} color={colors.textMuted} />
        <Text style={styles.count}>{comments}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 2,
      borderColor: colors.border,
    },
    count: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '700',
    },
    spacer: {
      flex: 1,
    },
  });
