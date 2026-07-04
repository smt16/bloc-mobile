import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '../../src/api/hooks';
import { Avatar } from '../../src/components/Avatar';
import { AvatarStack } from '../../src/components/AvatarStack';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { GradeChip } from '../../src/components/GradeChip';
import { Icon, type IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { colors, radius, spacing, typography } from '../../src/theme';

export default function RouteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: route, isLoading } = useRoute(id);

  if (isLoading || !route) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top', 'bottom']}>
        {isLoading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Text style={styles.notFound}>Route not found.</Text>
        )}
      </SafeAreaView>
    );
  }

  const logged = route.status === 'sent' || route.status === 'flashed';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[`${route.color}66`, colors.bg]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <IconButton name="close" onPress={() => router.back()} />
            <IconButton name="bookmark-outline" />
          </View>

          <View style={styles.heroBody}>
            <GradeChip grade={route.grade} size="lg" />
            <Text style={styles.routeName}>{route.name}</Text>
            <View style={styles.routeMetaRow}>
              <Icon name="business" size={14} color={colors.textMuted} />
              <Text style={styles.routeMeta}>
                {route.gym} · {route.wall}
              </Text>
            </View>
            <View style={styles.tags}>
              {route.style.map((s) => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.padded}>
          <View style={styles.statsRow}>
            <StatBox icon="people" value={`${route.sends}`} label="sends" />
            <StatBox icon="repeat" value={route.attemptsAvg.toFixed(1)} label="avg tries" />
            <StatBox icon="videocam" value={`${route.betaVideos}`} label="beta clips" />
          </View>

          <Card style={styles.setterCard}>
            <Avatar
              initials={route.setterInitials ?? '?'}
              color={route.color ?? colors.accent}
              size={40}
            />
            <View style={styles.setterCopy}>
              <Text style={styles.setterLabel}>Set by</Text>
              <Text style={styles.setterName}>{route.setter ?? 'Unknown'}</Text>
            </View>
            {route.setterNote ? (
              <Text style={styles.setterNote}>“{route.setterNote}”</Text>
            ) : null}
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beta clips</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.betaRow}
            >
              {route.recentSenders.slice(0, 3).map((c) => (
                <View key={c.id} style={styles.betaCard}>
                  <LinearGradient
                    colors={[`${c.avatarColor ?? colors.accent}66`, colors.surfaceMuted]}
                    style={styles.betaThumb}
                  >
                    <View style={styles.betaPlay}>
                      <Icon name="play" size={18} color={colors.text} />
                    </View>
                  </LinearGradient>
                  <View style={styles.betaMeta}>
                    <Avatar
                      initials={c.initials ?? '?'}
                      color={c.avatarColor ?? colors.surfaceMuted}
                      size={22}
                    />
                    <Text style={styles.betaName} numberOfLines={1}>
                      {c.name.split(' ')[0]}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sendersHeader}>
              <Text style={styles.sectionTitle}>Recent senders</Text>
              <AvatarStack
                colors={route.recentSenders.map(
                  (c) => c.avatarColor ?? colors.surfaceMuted,
                )}
                size={30}
                extra={Math.max(route.sends - route.recentSenders.length, 0)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <View style={styles.comments}>
              {route.comments.length === 0 ? (
                <Text style={styles.commentText}>No beta yet. Be the first!</Text>
              ) : (
                route.comments.map((c) => (
                  <View key={c.id} style={styles.comment}>
                    <Avatar
                      initials={c.climber?.initials ?? '?'}
                      color={c.climber?.avatarColor ?? colors.surfaceMuted}
                      size={36}
                    />
                    <View style={styles.commentBubble}>
                      <View style={styles.commentTop}>
                        <Text style={styles.commentName}>
                          {c.climber?.name ?? 'Climber'}
                        </Text>
                        <Text style={styles.commentTime}>{c.timeAgo}</Text>
                      </View>
                      <Text style={styles.commentText}>{c.body}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={logged ? 'Logged · Sent' : 'Log an attempt'}
          size="lg"
          variant={logged ? 'secondary' : 'primary'}
          onPress={() =>
            router.push({
              pathname: '/log',
              params: { routeId: route.id, grade: route.grade },
            })
          }
          leading={
            <Icon
              name={(logged ? 'checkmark-circle' : 'add') as IconName}
              size={20}
              color={logged ? colors.success : colors.accentText}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const StatBox: React.FC<{ icon: IconName; value: string; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <Card style={styles.statBox}>
    <Icon name={icon} size={18} color={colors.textMuted} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    ...typography.body,
    color: colors.textMuted,
  },
  content: {
    paddingBottom: spacing['2xl'],
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  heroBody: {
    gap: spacing.sm,
    marginTop: spacing['3xl'],
  },
  routeName: {
    ...typography.display,
    color: colors.text,
    fontSize: 36,
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeMeta: {
    ...typography.body,
    color: colors.textMuted,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  tagText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  setterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  setterCopy: {
    gap: 2,
  },
  setterLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  setterName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  setterNote: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
  },
  section: {
    marginTop: spacing['2xl'],
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  betaRow: {
    gap: spacing.md,
  },
  betaCard: {
    width: 130,
    gap: spacing.sm,
  },
  betaThumb: {
    width: 130,
    height: 180,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(11,11,15,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  betaName: {
    ...typography.caption,
    color: colors.textMuted,
  },
  sendersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comments: {
    gap: spacing.md,
  },
  comment: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  commentTime: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  commentText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
