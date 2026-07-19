import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCrews, useToggleCrew } from '../../src/api/hooks';
import type { Crew } from '../../src/api/types';
import { AvatarStack } from '../../src/components/AvatarStack';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { fonts, gradients, radius, shadows, spacing, typography, useTheme, type SemanticColors } from '../../src/theme';

export default function CrewsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
          <Text style={styles.subtitle}>Your people. Your parking lot.</Text>
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
            Send 5 slabs this week · 3 crews throwing down
          </Text>
        </View>
        <View style={styles.bannerBadge}>
          <Icon name="trophy" size={22} color={colors.accentText} />
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
                No crew yet. Find your people.
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
}> = ({ crew, joined, onToggle }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
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
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
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
      borderRadius: radius.md,
      padding: spacing.lg,
      marginBottom: spacing['2xl'],
      borderWidth: 2.5,
      borderColor: colors.text,
      ...shadows.card,
    },
    bannerCopy: {
      flex: 1,
      gap: 4,
    },
    bannerTitle: {
      fontFamily: fonts.display,
      fontSize: 24,
      lineHeight: 26,
      letterSpacing: 1,
      color: colors.accentText,
      textTransform: 'uppercase',
    },
    bannerSub: {
      fontFamily: fonts.mono,
      fontSize: 11,
      letterSpacing: 0.4,
      color: 'rgba(10,10,10,0.72)',
      fontWeight: '400',
    },
    bannerBadge: {
      width: 48,
      height: 48,
      borderRadius: radius.sm,
      backgroundColor: 'rgba(10,10,10,0.2)',
      borderWidth: 2,
      borderColor: 'rgba(10,10,10,0.45)',
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
