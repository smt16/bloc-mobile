import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { Icon, type IconName } from './Icon';
import type { Reaction } from '../data/mock';

type Props = {
  reactions: { fire: number; strong: number; clap: number };
  comments: number;
  reactedByMe?: Reaction;
};

const REACTIONS: { key: Reaction; icon: IconName; color: string; label: string }[] = [
  { key: 'fire', icon: 'flame', color: colors.accent, label: 'Fire' },
  { key: 'strong', icon: 'barbell', color: colors.purple, label: 'Strong' },
  { key: 'clap', icon: 'hand-left', color: colors.cyan, label: 'Respect' },
];

/** Climbing-native encouragement bar — fire / strong / respect + comments. */
export const ReactionBar: React.FC<Props> = ({ reactions, comments, reactedByMe }) => {
  const [mine, setMine] = useState<Reaction | undefined>(reactedByMe);

  const countFor = (key: Reaction) => {
    const base = reactions[key];
    if (reactedByMe === key && mine !== key) return base - 1;
    if (reactedByMe !== key && mine === key) return base + 1;
    return base;
  };

  return (
    <View style={styles.row}>
      {REACTIONS.map((r) => {
        const active = mine === r.key;
        return (
          <Pressable
            key={r.key}
            onPress={() => setMine(active ? undefined : r.key)}
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

const styles = StyleSheet.create({
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
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: 'transparent',
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
