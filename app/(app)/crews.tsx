import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCrews, useToggleCrew } from '../../src/api/hooks';
import type { Crew } from '../../src/api/types';
import { AvatarStack } from '../../src/components/AvatarStack';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { colors, gradients, radius, spacing, typography } from '../../src/theme';

export default function CrewsScreen() {
  const { data: crews, isLoading } = useCrews();
  const toggle = useToggleCrew();
  const mine = (crews ?? []).filter((c) => c.joined);
  const discover = (crews ?? []).filter((c) => !c.joined);

  const onToggle = (crew: Crew) =>
    toggle.mutate({ id: crew.id, join: !crew.joined });

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Crews</Text>
          <Text style={styles.subtitle}>Your climbing communities.</Text>
        </View>
        <IconButton name="add" onPress={() => undefined} />
      </View>

      <LinearGradient
        colors={gradients.aurora}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>Slab Club challenge</Text>
          <Text style={styles.bannerSub}>
            Send 5 slabs this week · 3 crews competing
          </Text>
        </View>
        <View style={styles.bannerBadge}>
          <Icon name="trophy" size={22} color={colors.bg} />
        </View>
      </LinearGradient>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <>
          <SectionHeader title="Your crews" />
          <View style={styles.list}>
            {mine.length === 0 ? (
              <Text style={styles.emptyText}>
                You haven’t joined a crew yet.
              </Text>
            ) : (
              mine.map((crew) => (
                <CrewCard
                  key={crew.id}
                  crew={crew}
                  joined
                  onToggle={() => onToggle(crew)}
                />
              ))
            )}
          </View>

          <View style={styles.spacer} />
          <SectionHeader title="Discover" action="See all" />
          <View style={styles.list}>
            {discover.map((crew) => (
              <CrewCard key={crew.id} crew={crew} onToggle={() => onToggle(crew)} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const CrewCard: React.FC<{
  crew: Crew;
  joined?: boolean;
  onToggle: () => void;
}> = ({ crew, joined, onToggle }) => (
  <Card style={styles.crewCard}>
    <View style={styles.crewTop}>
      <View style={styles.crewEmoji}>
        <Text style={styles.crewEmojiText}>{crew.emoji}</Text>
      </View>
      <View style={styles.crewCopy}>
        <Text style={styles.crewName}>{crew.name}</Text>
        <Text style={styles.crewBlurb} numberOfLines={1}>
          {crew.blurb}
        </Text>
      </View>
      {joined ? (
        <Pressable style={styles.joinedPill} onPress={onToggle}>
          <Icon name="checkmark" size={13} color={colors.success} />
          <Text style={styles.joinedText}>Joined</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.joinBtn} onPress={onToggle}>
          <Text style={styles.joinText}>Join</Text>
        </Pressable>
      )}
    </View>
    <View style={styles.crewFooter}>
      <AvatarStack colors={crew.memberColors} size={26} />
      <Text style={styles.crewMembers}>{crew.members} members</Text>
      <View style={styles.activeDot} />
      <Text style={styles.crewActive}>{crew.activeToday} active today</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  bannerCopy: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    ...typography.h2,
    color: colors.bg,
  },
  bannerSub: {
    ...typography.caption,
    color: 'rgba(11,11,15,0.72)',
    fontWeight: '600',
  },
  bannerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(11,11,15,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: spacing.md,
  },
  loader: {
    marginTop: spacing['2xl'],
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  spacer: {
    height: spacing['2xl'],
  },
  crewCard: {
    gap: spacing.lg,
  },
  crewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  crewEmoji: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crewEmojiText: {
    fontSize: 24,
  },
  crewCopy: {
    flex: 1,
    gap: 2,
  },
  crewName: {
    ...typography.bodyStrong,
    fontSize: 17,
    color: colors.text,
  },
  crewBlurb: {
    ...typography.caption,
    color: colors.textMuted,
  },
  joinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  joinedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  joinBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  joinText: {
    ...typography.caption,
    color: colors.bg,
    fontWeight: '800',
  },
  crewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  crewMembers: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.success,
  },
  crewActive: {
    ...typography.caption,
    color: colors.success,
  },
});
