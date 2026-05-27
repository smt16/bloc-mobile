import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/theme';

type FeedItem = {
  id: string;
  climber: string;
  action: string;
  detail: string;
  gym: string;
  timeAgo: string;
  accent?: boolean;
};

const FEED: FeedItem[] = [
  {
    id: '1',
    climber: 'Maya R.',
    action: 'sent her first V6',
    detail: '“Tundra” · Crimpy slab · 12 sessions to send',
    gym: 'Brooklyn Boulders',
    timeAgo: '2h',
    accent: true,
  },
  {
    id: '2',
    climber: 'Diego A.',
    action: 'logged a session',
    detail: '8 problems · V2 → V4 · 1h 45m',
    gym: 'Movement Denver',
    timeAgo: '5h',
  },
  {
    id: '3',
    climber: 'Yuki T.',
    action: 'flashed a project',
    detail: '“Static Memory” · V5 · powerful overhang',
    gym: 'B-Pump Ogikubo',
    timeAgo: '1d',
  },
];

export default function FeedScreen() {
  const { user } = useAuth();
  const firstName =
    typeof user?.name === 'string'
      ? user.name.split(' ')[0]
      : user?.nickname ?? 'climber';

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.greeting}>Hey {firstName} 👋</Text>
        <Text style={styles.subtitle}>
          Here&apos;s what your tribe is sending right now.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Active streak" value="6" unit="days" />
        <Stat label="Hardest send" value="V5" unit="this week" highlight />
        <Stat label="Sessions" value="14" unit="this month" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tribe feed</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>

        <View style={styles.feed}>
          {FEED.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const Stat: React.FC<{
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}> = ({ label, value, unit, highlight }) => (
  <Card style={[styles.stat, highlight && styles.statHighlight]} padded>
    <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>
      {value}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
  </Card>
);

const FeedCard: React.FC<{ item: FeedItem }> = ({ item }) => (
  <Card style={styles.feedCard}>
    <View style={styles.feedRow}>
      <View style={[styles.avatar, item.accent && styles.avatarAccent]}>
        <Text style={styles.avatarText}>{item.climber.charAt(0)}</Text>
      </View>
      <View style={styles.feedBody}>
        <Text style={styles.feedLine}>
          <Text style={styles.feedClimber}>{item.climber}</Text>
          <Text style={styles.feedAction}> {item.action}</Text>
        </Text>
        <Text style={styles.feedDetail}>{item.detail}</Text>
        <Text style={styles.feedMeta}>
          {item.gym} · {item.timeAgo}
        </Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing['2xl'],
  },
  eyebrow: {
    ...typography.overline,
    color: colors.accent,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  stat: {
    flex: 1,
    gap: spacing.xs,
  },
  statHighlight: {
    backgroundColor: colors.accentMuted,
    borderColor: 'transparent',
  },
  statValue: {
    ...typography.h1,
    color: colors.text,
  },
  statValueHighlight: {
    color: colors.accent,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statUnit: {
    ...typography.caption,
    color: colors.textSubtle,
    fontSize: 11,
  },
  section: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  sectionAction: {
    ...typography.caption,
    color: colors.accent,
  },
  feed: {
    gap: spacing.md,
  },
  feedCard: {
    paddingVertical: spacing.lg,
  },
  feedRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarAccent: {
    backgroundColor: colors.accent,
  },
  avatarText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  feedBody: {
    flex: 1,
    gap: spacing.xs,
  },
  feedLine: {
    ...typography.body,
  },
  feedClimber: {
    color: colors.text,
    fontWeight: '600',
  },
  feedAction: {
    color: colors.textMuted,
  },
  feedDetail: {
    ...typography.body,
    color: colors.text,
  },
  feedMeta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
});
