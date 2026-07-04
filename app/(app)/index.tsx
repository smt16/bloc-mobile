import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useClimbers,
  useFeed,
  useProfile,
  useReactToFeedItem,
} from '../../src/api/hooks';
import type { FeedItem, FeedKind } from '../../src/api/types';
import { useAuth } from '../../src/auth/AuthContext';
import { Avatar } from '../../src/components/Avatar';
import { Card } from '../../src/components/Card';
import { GradeChip } from '../../src/components/GradeChip';
import { Icon, type IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { ProgressBar } from '../../src/components/ProgressBar';
import { ReactionBar } from '../../src/components/ReactionBar';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { colors, gradients, radius, spacing, typography } from '../../src/theme';

const KIND_META: Record<FeedKind, { icon: IconName; label: string; color: string }> = {
  send: { icon: 'trophy', label: 'Sent', color: colors.accent },
  session: { icon: 'time', label: 'Session', color: colors.cyan },
  milestone: { icon: 'flame', label: 'Milestone', color: colors.purple },
  project: { icon: 'construct', label: 'Projecting', color: colors.warning },
};

export default function FeedScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const feedQuery = useFeed('global');
  const profileQuery = useProfile();
  const climbersQuery = useClimbers();
  const react = useReactToFeedItem();

  const firstName =
    typeof user?.name === 'string'
      ? user.name.split(' ')[0]
      : (user?.nickname as string) ?? 'climber';

  const stats = profileQuery.data?.stats;
  const weeklyGoal = 4;
  const sessionsThisWeek = Math.min(stats?.sessions ?? 0, weeklyGoal);

  const stories = useMemo(() => {
    const me = profileQuery.data
      ? [
          {
            id: profileQuery.data.id,
            name: profileQuery.data.name,
            initials: profileQuery.data.initials,
            avatarColor: profileQuery.data.avatarColor,
          },
        ]
      : [{ id: 'me', name: 'You', initials: 'Y', avatarColor: colors.accent }];
    return [...me, ...(climbersQuery.data ?? [])];
  }, [profileQuery.data, climbersQuery.data]);

  return (
    <Screen scroll padded={false} edges={['top']}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>
            {new Date()
              .toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
              .toUpperCase()}
          </Text>
          <Text style={styles.greeting}>Hey {firstName} 👋</Text>
        </View>
        <View style={styles.headerActions}>
          <IconButton name="calendar-outline" onPress={() => router.push('/sessions')} />
          <IconButton name="notifications-outline" badge />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stories}
      >
        {stories.map((c, i) => (
          <Pressable key={c.id} style={styles.story}>
            <Avatar
              initials={c.initials ?? '?'}
              color={c.avatarColor ?? colors.surfaceMuted}
              size={58}
              gradientRing={i !== 0}
              ring={i === 0}
            />
            {i === 0 ? (
              <View style={styles.storyAdd}>
                <Icon name="add" size={13} color={colors.bg} />
              </View>
            ) : null}
            <Text style={styles.storyName} numberOfLines={1}>
              {i === 0 ? 'Your story' : c.name.split(' ')[0]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.padded}>
        <Pressable onPress={() => router.push('/sessions')}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroStreak}>
                <Icon name="flame" size={18} color={colors.bg} />
                <Text style={styles.heroStreakText}>
                  {stats?.streak ?? 0}-day streak
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color="rgba(11,11,15,0.6)" />
            </View>
            <Text style={styles.heroTitle}>
              {sessionsThisWeek} of {weeklyGoal} sessions this week
            </Text>
            <Text style={styles.heroSub}>
              {sessionsThisWeek >= weeklyGoal
                ? 'Weekly goal smashed. 💥'
                : 'One more to hit your weekly goal.'}
            </Text>
            <ProgressBar
              progress={sessionsThisWeek / weeklyGoal}
              height={10}
              colorsOverride={['#0B0B0F', 'rgba(11,11,15,0.7)']}
              track="rgba(11,11,15,0.25)"
              style={styles.heroBar}
            />
          </LinearGradient>
        </Pressable>

        <View style={styles.statsRow}>
          <Stat icon="trophy" label="Hardest" value={stats?.hardest ?? '—'} tone={colors.accent} />
          <Stat icon="flash" label="Flashes" value={`${stats?.flashes ?? 0}`} tone={colors.cyan} />
          <Stat icon="albums" label="Sends" value={`${stats?.sends ?? 0}`} tone={colors.purple} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Tribe feed" action="Filters" />
          {feedQuery.isLoading ? (
            <ActivityIndicator color={colors.accent} style={styles.loader} />
          ) : feedQuery.isError ? (
            <Text style={styles.emptyText}>Couldn’t load the feed. Pull to retry.</Text>
          ) : (feedQuery.data?.length ?? 0) === 0 ? (
            <Text style={styles.emptyText}>No activity yet — go log a climb!</Text>
          ) : (
            <View style={styles.feed}>
              {feedQuery.data!.map((item) => (
                <FeedCard
                  key={item.id}
                  item={item}
                  onOpenRoute={(id) => router.push(`/route/${id}`)}
                  onReact={(type) =>
                    react.mutate({ feedItemId: item.id, type })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const Stat: React.FC<{ icon: IconName; label: string; value: string; tone: string }> = ({
  icon,
  label,
  value,
  tone,
}) => (
  <Card style={styles.stat} padded>
    <View style={[styles.statIcon, { backgroundColor: `${tone}22` }]}>
      <Icon name={icon} size={16} color={tone} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const FeedCard: React.FC<{
  item: FeedItem;
  onOpenRoute: (id: string) => void;
  onReact: (type: import('../../src/api/types').ReactionType) => void;
}> = ({ item, onOpenRoute, onReact }) => {
  const meta = KIND_META[item.kind];
  const climberInitials = item.climber?.initials ?? '?';
  const climberColor = item.climber?.avatarColor ?? colors.surfaceMuted;
  const climberName = item.climber?.name ?? 'Climber';
  return (
    <Card style={styles.feedCard} padded={false}>
      <View style={styles.feedHeader}>
        <Avatar initials={climberInitials} color={climberColor} size={44} />
        <View style={styles.feedHeaderCopy}>
          <Text style={styles.feedLine} numberOfLines={1}>
            <Text style={styles.feedClimber}>{climberName}</Text>
            <Text style={styles.feedAction}> {item.headline}</Text>
          </Text>
          <View style={styles.feedMetaRow}>
            <Icon name="location" size={12} color={colors.textSubtle} />
            <Text style={styles.feedMeta}>
              {item.gym} · {item.timeAgo}
            </Text>
          </View>
        </View>
        <View style={[styles.kindPill, { backgroundColor: `${meta.color}1F` }]}>
          <Icon name={meta.icon} size={12} color={meta.color} />
          <Text style={[styles.kindPillText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      {item.routeName && item.routeId ? (
        <Pressable
          style={styles.routeChipRow}
          onPress={() => onOpenRoute(item.routeId!)}
        >
          {item.grade ? <GradeChip grade={item.grade} /> : null}
          <Text style={styles.routeName}>{item.routeName}</Text>
          {item.attempts ? (
            <Text style={styles.routeAttempts}>· {item.attempts} tries</Text>
          ) : null}
          <View style={{ flex: 1 }} />
          <Icon name="chevron-forward" size={16} color={colors.textSubtle} />
        </Pressable>
      ) : null}

      {item.note ? <Text style={styles.feedNote}>{item.note}</Text> : null}

      {item.media ? (
        <LinearGradient
          colors={[`${climberColor}55`, colors.surfaceMuted]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.media}
        >
          <View style={styles.playButton}>
            <Icon name="play" size={22} color={colors.text} />
          </View>
          <Text style={styles.mediaLabel}>Send clip · 0:14</Text>
        </LinearGradient>
      ) : null}

      <View style={styles.feedFooter}>
        <ReactionBar
          reactions={item.reactions}
          comments={item.comments}
          reactedByMe={item.reactedByMe}
          onReact={onReact}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.accent,
    marginBottom: 2,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  stories: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  story: {
    alignItems: 'center',
    width: 66,
    gap: 6,
  },
  storyAdd: {
    position: 'absolute',
    top: 40,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  storyName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    maxWidth: 66,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(11,11,15,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  heroStreakText: {
    ...typography.caption,
    color: colors.bg,
    fontWeight: '800',
  },
  heroTitle: {
    ...typography.h1,
    color: colors.bg,
    fontSize: 24,
  },
  heroSub: {
    ...typography.body,
    color: 'rgba(11,11,15,0.7)',
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  heroBar: {
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  stat: {
    flex: 1,
    gap: 6,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  feed: {
    gap: spacing.lg,
  },
  feedCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  feedHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  feedLine: {
    ...typography.body,
  },
  feedClimber: {
    color: colors.text,
    fontWeight: '700',
  },
  feedAction: {
    color: colors.textMuted,
  },
  feedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedMeta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  kindPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  kindPillText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  routeChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  routeName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  routeAttempts: {
    ...typography.caption,
    color: colors.textMuted,
  },
  feedNote: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  media: {
    height: 168,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(11,11,15,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  feedFooter: {
    marginTop: spacing.xs,
  },
  loader: {
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
