import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useProfile } from '../../../src/api/hooks';
import type { Achievement, Milestone } from '../../../src/api/types';
import { useAuth } from '../../../src/auth/AuthContext';
import { Avatar } from '../../../src/components/Avatar';
import { Card } from '../../../src/components/Card';
import { Icon, type IconName } from '../../../src/components/Icon';
import { Screen } from '../../../src/components/Screen';
import {
  gradeColor,
  gradients,
  radius,
  spacing,
  typography,
  useTheme,
  type SemanticColors,
} from '../../../src/theme';

type ProfileTab = 'sends' | 'timeline' | 'achievements';

const getTone = (colors: SemanticColors): Record<Milestone['tone'], string> => ({
  accent: colors.accent,
  purple: colors.purple,
  cyan: colors.cyan,
  success: colors.success,
});

const TAB_META: { key: ProfileTab; icon: IconName; label: string }[] = [
  { key: 'sends', icon: 'grid-outline', label: 'Sends' },
  { key: 'timeline', icon: 'list-outline', label: 'Timeline' },
  { key: 'achievements', icon: 'ribbon-outline', label: 'Badges' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: profile, isLoading, refetch, isRefetching } = useProfile();
  const [tab, setTab] = useState<ProfileTab>('sends');
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    profile?.name ||
    (typeof user?.name === 'string' && user.name) ||
    (typeof user?.nickname === 'string' && user.nickname) ||
    'Bloc climber';
  const handle = profile?.handle ? `@${profile.handle}` : '@climber';
  const picture =
    profile?.pictureUrl ??
    (typeof user?.picture === 'string' ? user.picture : undefined);
  const initials = profile?.initials ?? displayName.charAt(0).toUpperCase();
  const avatarColor = profile?.avatarColor ?? colors.accent;

  const stats = profile?.stats ?? {
    sends: 0,
    flashes: 0,
    sessions: 0,
    crews: 0,
    streak: 0,
    hardest: null,
  };
  const gradePyramid = profile?.gradePyramid ?? [];
  const timeline = profile?.timeline ?? [];
  const achievements = profile?.achievements ?? [];
  const homeGymName = profile?.homeGym?.name ?? null;
  const peakGrade = stats.hardest ?? profile?.topGrade ?? '—';
  const styleTags = profile?.styleTags ?? [];
  const bio = profile?.bio?.trim() ?? '';

  const maxSends = Math.max(1, ...gradePyramid.map((g) => g.sends));

  const openMenu = () => {
    Alert.alert('Account', undefined, [
      {
        text: 'Edit profile',
        onPress: () => router.push('/edit-profile' as Href),
      },
      {
        text: 'View logbook',
        onPress: () => router.push('/sessions'),
      },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: handleLogout,
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await logout();
    } catch (error) {
      Alert.alert(
        'Could not sign out',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setSigningOut(false);
    }
  };

  const shareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${displayName} on Bloc — peak ${peakGrade}${homeGymName ? ` at ${homeGymName}` : ''}.`,
      });
    } catch {
      // User dismissed
    }
  };

  if (isLoading && !profile) {
    return (
      <Screen edges={['top']}>
        <View style={styles.loader}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      padded={false}
      edges={['top']}
      scrollViewProps={{
        refreshControl: (
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        ),
      }}
    >
      <View style={styles.topBar}>
        <View style={styles.topSide} />
        <Text style={styles.username} numberOfLines={1}>
          {handle}
        </Text>
        <Pressable onPress={openMenu} style={styles.topSide} hitSlop={8}>
          <Icon name="menu-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.identityRow}>
        <Avatar
          initials={initials}
          uri={picture}
          color={avatarColor}
          size={86}
          gradientRing
        />
        <View style={styles.statsCol}>
          <StatCell value={`${stats.sends}`} label="Sends" />
          <StatCell
            value={`${stats.sessions}`}
            label="Sessions"
            onPress={() => router.push('/sessions')}
          />
          <StatCell value={`${stats.streak}d`} label="Streak" highlight />
        </View>
      </View>

      <View style={styles.identityCopy}>
        <Text style={styles.displayName}>{displayName}</Text>
        {bio ? <Text style={styles.bio}>{bio}</Text> : null}
        {homeGymName ? (
          <View style={styles.metaLine}>
            <Icon name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{homeGymName}</Text>
          </View>
        ) : null}
        {styleTags.length > 0 ? (
          <View style={styles.tagRow}>
            {styleTags.map((tag) => (
              <View key={tag} style={styles.styleTag}>
                <Text style={styles.styleTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => router.push('/edit-profile' as Href)}
        >
          <Text style={styles.actionBtnText}>Edit profile</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={shareProfile}>
          <Text style={styles.actionBtnText}>Share profile</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlights}
      >
        <Highlight
          icon="trending-up"
          label="Peak"
          value={peakGrade}
          colors={gradients.brand}
        />
        <Highlight
          icon="flame"
          label="Streak"
          value={`${stats.streak}d`}
          colors={gradients.ember}
        />
        <Highlight
          icon="flash"
          label="Flashes"
          value={`${stats.flashes}`}
          colors={gradients.aurora}
        />
        {homeGymName ? (
          <Highlight
            icon="business-outline"
            label="Home"
            value={homeGymName.split(' ')[0]}
            colors={gradients.send}
          />
        ) : null}
      </ScrollView>

      <View style={styles.tabBar}>
        {TAB_META.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
            >
              <Icon
                name={t.icon}
                size={22}
                color={active ? colors.text : colors.textSubtle}
              />
              {active ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tabContent}>
        {tab === 'sends' ? (
          gradePyramid.length === 0 ? (
            <EmptyTab
              icon="albums-outline"
              title="No sends yet"
              hint="Log your first climb and your grade pyramid will show up here."
              action="Log a climb"
              onAction={() => router.push('/log')}
            />
          ) : (
            <Card style={styles.pyramid}>
              {gradePyramid.map((g) => (
                <View key={g.grade} style={styles.pyramidRow}>
                  <Text
                    style={[styles.pyramidGrade, { color: gradeColor(g.grade) }]}
                  >
                    {g.grade}
                  </Text>
                  <View style={styles.pyramidTrack}>
                    <View
                      style={[
                        styles.pyramidBar,
                        {
                          width: `${(g.sends / maxSends) * 100}%`,
                          backgroundColor: gradeColor(g.grade),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.pyramidCount}>{g.sends}</Text>
                </View>
              ))}
            </Card>
          )
        ) : null}

        {tab === 'timeline' ? (
          timeline.length === 0 ? (
            <EmptyTab
              icon="time-outline"
              title="No milestones yet"
              hint="Send harder, climb often — your progression timeline builds itself."
            />
          ) : (
            <Card style={styles.timeline}>
              {timeline.map((m, i) => (
                <TimelineRow
                  key={m.id}
                  milestone={m}
                  last={i === timeline.length - 1}
                />
              ))}
            </Card>
          )
        ) : null}

        {tab === 'achievements' ? (
          achievements.length === 0 ? (
            <EmptyTab
              icon="ribbon-outline"
              title="No badges yet"
              hint="Unlock achievements as you climb, streak, and explore gyms."
            />
          ) : (
            <View style={styles.badgeGrid}>
              {achievements.map((a) => (
                <BadgeTile key={a.id} achievement={a} />
              ))}
            </View>
          )
        ) : null}
      </View>

      {signingOut ? (
        <View style={styles.signingOut}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : null}

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const StatCell: React.FC<{
  value: string;
  label: string;
  highlight?: boolean;
  onPress?: () => void;
}> = ({ value, label, highlight, onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const inner = (
    <>
      <Text style={[styles.statValue, highlight && { color: colors.accent }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </>
  );
  if (onPress) {
    return (
      <Pressable style={styles.statCell} onPress={onPress}>
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.statCell}>{inner}</View>;
};

const Highlight: React.FC<{
  icon: IconName;
  label: string;
  value: string;
  colors: readonly [string, string, ...string[]];
}> = ({ icon, label, value, colors: gradient }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.highlight}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.highlightRing}
      >
        <View style={styles.highlightInner}>
          <Icon name={icon} size={20} color={colors.text} />
        </View>
      </LinearGradient>
      <Text style={styles.highlightValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.highlightLabel}>{label}</Text>
    </View>
  );
};

const EmptyTab: React.FC<{
  icon: IconName;
  title: string;
  hint: string;
  action?: string;
  onAction?: () => void;
}> = ({ icon, title, hint, action, onAction }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.emptyTab}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={28} color={colors.textSubtle} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyHint}>{hint}</Text>
      {action && onAction ? (
        <Pressable style={styles.emptyAction} onPress={onAction}>
          <Text style={styles.emptyActionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const TimelineRow: React.FC<{ milestone: Milestone; last: boolean }> = ({
  milestone,
  last,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tone = getTone(colors)[milestone.tone];
  return (
    <View style={styles.tlRow}>
      <View style={styles.tlGutter}>
        <View
          style={[
            styles.tlNode,
            { backgroundColor: `${tone}26`, borderColor: tone },
          ]}
        >
          <Icon
            name={(milestone.icon ?? 'trophy') as IconName}
            size={16}
            color={tone}
          />
        </View>
        {!last ? <View style={styles.tlLine} /> : null}
      </View>
      <View style={styles.tlBody}>
        <View style={styles.tlHeader}>
          <Text style={styles.tlTitle}>{milestone.title}</Text>
          <Text style={styles.tlDate}>{milestone.date}</Text>
        </View>
        {milestone.detail ? (
          <Text style={styles.tlDetail}>{milestone.detail}</Text>
        ) : null}
      </View>
    </View>
  );
};

const BadgeTile: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tone = getTone(colors)[achievement.tone];
  return (
    <Card style={[styles.badge, !achievement.earned && styles.badgeLocked]}>
      <View
        style={[
          styles.badgeIcon,
          {
            backgroundColor: achievement.earned
              ? `${tone}22`
              : colors.surfaceMuted,
          },
        ]}
      >
        <Icon
          name={
            achievement.earned
              ? ((achievement.icon ?? 'ribbon') as IconName)
              : 'lock-closed'
          }
          size={20}
          color={achievement.earned ? tone : colors.textSubtle}
        />
      </View>
      <Text
        style={[
          styles.badgeLabel,
          !achievement.earned && { color: colors.textSubtle },
        ]}
        numberOfLines={1}
      >
        {achievement.label}
      </Text>
    </Card>
  );
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 320,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    topSide: {
      width: 40,
      alignItems: 'flex-end',
    },
    username: {
      ...typography.bodyStrong,
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    identityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing['2xl'],
    },
    statsCol: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statCell: {
      alignItems: 'center',
      gap: 2,
    },
    statValue: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '700',
      color: colors.text,
    },
    statLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
    identityCopy: {
      paddingHorizontal: spacing.xl,
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
    displayName: {
      ...typography.bodyStrong,
      color: colors.text,
      fontSize: 15,
    },
    bio: {
      ...typography.body,
      color: colors.text,
      lineHeight: 20,
    },
    metaLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    metaText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    styleTag: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
      borderRadius: radius.pill,
    },
    styleTagText: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '600',
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      marginTop: spacing.lg,
    },
    actionBtn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    actionBtnText: {
      ...typography.caption,
      color: colors.text,
      fontWeight: '700',
    },
    highlights: {
      paddingHorizontal: spacing.xl,
      gap: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
    },
    highlight: {
      alignItems: 'center',
      width: 72,
      gap: 4,
    },
    highlightRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      padding: 2.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlightInner: {
      width: '100%',
      height: '100%',
      borderRadius: 29,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlightValue: {
      ...typography.caption,
      color: colors.text,
      fontWeight: '700',
      maxWidth: 72,
      textAlign: 'center',
    },
    highlightLabel: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textSubtle,
    },
    tabBar: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      marginTop: spacing.sm,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    tabIndicator: {
      width: '100%',
      height: 2,
      backgroundColor: colors.text,
      borderRadius: 1,
    },
    tabContent: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      minHeight: 200,
    },
    pyramid: {
      gap: spacing.md,
    },
    pyramidRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    pyramidGrade: {
      ...typography.bodyStrong,
      width: 32,
      fontWeight: '800',
    },
    pyramidTrack: {
      flex: 1,
      height: 22,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.sm,
      overflow: 'hidden',
    },
    pyramidBar: {
      height: '100%',
      borderRadius: radius.sm,
    },
    pyramidCount: {
      ...typography.caption,
      color: colors.textMuted,
      width: 24,
      textAlign: 'right',
    },
    timeline: {
      paddingBottom: 0,
    },
    tlRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    tlGutter: {
      alignItems: 'center',
      width: 34,
    },
    tlNode: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tlLine: {
      flex: 1,
      width: 2,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    tlBody: {
      flex: 1,
      paddingBottom: spacing.lg,
    },
    tlHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tlTitle: {
      ...typography.bodyStrong,
      color: colors.text,
    },
    tlDate: {
      ...typography.caption,
      color: colors.textSubtle,
    },
    tlDetail: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
    badgeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    badge: {
      width: '31%',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
    },
    badgeLocked: {
      opacity: 0.55,
    },
    badgeIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeLabel: {
      ...typography.caption,
      fontSize: 11,
      color: colors.text,
      textAlign: 'center',
      fontWeight: '600',
    },
    emptyTab: {
      alignItems: 'center',
      paddingVertical: spacing['3xl'],
      gap: spacing.sm,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    emptyTitle: {
      ...typography.bodyStrong,
      color: colors.text,
    },
    emptyHint: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      maxWidth: 260,
    },
    emptyAction: {
      marginTop: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: colors.accentMuted,
    },
    emptyActionText: {
      ...typography.caption,
      color: colors.accent,
      fontWeight: '700',
    },
    signingOut: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(11,11,15,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomSpace: {
      height: spacing['3xl'],
    },
  });
