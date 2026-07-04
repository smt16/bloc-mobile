import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Icon, type IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import {
  achievements,
  gradePyramid,
  profileStats,
  timeline,
  type Achievement,
  type Milestone,
} from '../../src/data/mock';
import {
  colors,
  gradeColor,
  gradients,
  radius,
  spacing,
  typography,
} from '../../src/theme';

const TONE: Record<Milestone['tone'], string> = {
  accent: colors.accent,
  purple: colors.purple,
  cyan: colors.cyan,
  success: colors.success,
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

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

  const displayName =
    (typeof user?.name === 'string' && user.name) ||
    (typeof user?.nickname === 'string' && user.nickname) ||
    'Bloc climber';
  const email = typeof user?.email === 'string' ? user.email : undefined;
  const picture = typeof user?.picture === 'string' ? user.picture : undefined;
  const initial = displayName.charAt(0).toUpperCase();

  const maxSends = Math.max(...gradePyramid.map((g) => g.sends));

  return (
    <Screen scroll padded={false} edges={['top']}>
      <LinearGradient
        colors={[colors.purpleMuted, 'rgba(11,11,15,0)']}
        style={styles.heroGlow}
      />

      <View style={styles.headerActions}>
        <IconButton name="share-outline" />
        <IconButton name="settings-outline" />
      </View>

      <View style={styles.header}>
        <Avatar
          initials={initial}
          uri={picture}
          color={colors.accent}
          size={92}
          gradientRing
        />
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.handle}>
          {email ?? '@climber'} · {'The Cliffs LIC'}
        </Text>
        <View style={styles.tagRow}>
          <View style={styles.metaTag}>
            <Icon name="trending-up" size={13} color={colors.accent} />
            <Text style={styles.metaTagText}>Peak V5</Text>
          </View>
          <View style={styles.metaTag}>
            <Icon name="footsteps" size={13} color={colors.cyan} />
            <Text style={styles.metaTagText}>Crimpy slabs</Text>
          </View>
        </View>
      </View>

      <View style={styles.padded}>
        <Card style={styles.statsCard}>
          <StatCell label="Sends" value={`${profileStats.sends}`} />
          <View style={styles.statDivider} />
          <StatCell label="Sessions" value={`${profileStats.sessions}`} />
          <View style={styles.statDivider} />
          <StatCell label="Crews" value={`${profileStats.crews}`} />
          <View style={styles.statDivider} />
          <StatCell label="Streak" value={`${profileStats.streak}d`} highlight />
        </Card>

        <View style={styles.section}>
          <SectionHeader title="Grade pyramid" action="Sessions" onAction={() => router.push('/sessions')} />
          <Card style={styles.pyramid}>
            {gradePyramid.map((g) => (
              <View key={g.grade} style={styles.pyramidRow}>
                <Text style={[styles.pyramidGrade, { color: gradeColor(g.grade) }]}>
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
        </View>

        <View style={styles.section}>
          <SectionHeader title="Progression timeline" />
          <Card style={styles.timeline}>
            {timeline.map((m, i) => (
              <TimelineRow key={m.id} milestone={m} last={i === timeline.length - 1} />
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Achievements" action="View all" />
          <View style={styles.badgeGrid}>
            {achievements.map((a) => (
              <BadgeTile key={a.id} achievement={a} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Settings" />
          <Card padded={false}>
            <SettingRow icon="lock-closed-outline" label="Privacy" value="Public" />
            <Divider />
            <SettingRow icon="notifications-outline" label="Notifications" value="On" />
            <Divider />
            <SettingRow icon="help-buoy-outline" label="Support" value="" />
          </Card>
        </View>

        <Button
          label="Sign out"
          variant="secondary"
          loading={signingOut}
          onPress={handleLogout}
          leading={<Icon name="log-out-outline" size={18} color={colors.text} />}
          style={styles.signOut}
        />
        <View style={styles.bottomSpace} />
      </View>
    </Screen>
  );
}

const StatCell: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <View style={styles.statCell}>
    <Text style={[styles.statValue, highlight && { color: colors.accent }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TimelineRow: React.FC<{ milestone: Milestone; last: boolean }> = ({
  milestone,
  last,
}) => {
  const tone = TONE[milestone.tone];
  return (
    <View style={styles.tlRow}>
      <View style={styles.tlGutter}>
        <View style={[styles.tlNode, { backgroundColor: `${tone}26`, borderColor: tone }]}>
          <Icon name={milestone.icon as IconName} size={16} color={tone} />
        </View>
        {!last ? <View style={styles.tlLine} /> : null}
      </View>
      <View style={styles.tlBody}>
        <View style={styles.tlHeader}>
          <Text style={styles.tlTitle}>{milestone.title}</Text>
          <Text style={styles.tlDate}>{milestone.date}</Text>
        </View>
        <Text style={styles.tlDetail}>{milestone.detail}</Text>
      </View>
    </View>
  );
};

const BadgeTile: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const tone = TONE[achievement.tone];
  return (
    <Card style={[styles.badge, !achievement.earned && styles.badgeLocked]}>
      <View
        style={[
          styles.badgeIcon,
          { backgroundColor: achievement.earned ? `${tone}22` : colors.surfaceMuted },
        ]}
      >
        <Icon
          name={achievement.earned ? (achievement.icon as IconName) : 'lock-closed'}
          size={20}
          color={achievement.earned ? tone : colors.textSubtle}
        />
      </View>
      <Text
        style={[styles.badgeLabel, !achievement.earned && { color: colors.textSubtle }]}
        numberOfLines={1}
      >
        {achievement.label}
      </Text>
    </Card>
  );
};

const SettingRow: React.FC<{ icon: IconName; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingIcon}>
      <Icon name={icon} size={18} color={colors.textMuted} />
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <View style={{ flex: 1 }} />
    {value ? <Text style={styles.settingValue}>{value}</Text> : null}
    <Icon name="chevron-forward" size={16} color={colors.textSubtle} />
  </View>
);

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  heroGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
  },
  handle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  metaTagText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 34,
    backgroundColor: colors.border,
  },
  section: {
    marginTop: spacing['2xl'],
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingIcon: {
    width: 32,
    alignItems: 'center',
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  settingValue: {
    ...typography.body,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  signOut: {
    marginTop: spacing['2xl'],
  },
  bottomSpace: {
    height: spacing['3xl'],
  },
});
