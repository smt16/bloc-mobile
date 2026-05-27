import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
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

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          {picture ? (
            <Image source={{ uri: picture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{displayName}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
      </View>

      <View style={styles.statsRow}>
        <Stat label="Sends" value="48" />
        <Stat label="Sessions" value="22" />
        <Stat label="Crews" value="3" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Card>
          <Row label="Home gym" value="The Cliffs LIC" />
          <Divider />
          <Row label="Preferred style" value="Crimpy slabs" />
          <Divider />
          <Row label="Member since" value="May 2026" />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bloc</Text>
        <Card>
          <Row label="Privacy" value="Manage" muted />
          <Divider />
          <Row label="Notifications" value="On" muted />
          <Divider />
          <Row label="Support" value="Get help" muted />
        </Card>
      </View>

      <Button
        label="Sign out"
        variant="secondary"
        loading={signingOut}
        onPress={handleLogout}
        style={styles.signOut}
      />
    </Screen>
  );
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card style={styles.stat} padded>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

const Row: React.FC<{ label: string; value: string; muted?: boolean }> = ({
  label,
  value,
  muted,
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, muted && styles.rowValueMuted]}>{value}</Text>
  </View>
);

const Divider: React.FC = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  avatarWrap: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.accent,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarFallback: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.h1,
    color: colors.text,
  },
  name: {
    ...typography.h1,
    color: colors.text,
  },
  email: {
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
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.h1,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text,
  },
  rowValue: {
    ...typography.body,
    color: colors.textMuted,
  },
  rowValueMuted: {
    color: colors.accent,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  signOut: {
    marginTop: spacing.md,
  },
});
