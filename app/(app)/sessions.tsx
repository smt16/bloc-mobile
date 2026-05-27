import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, radius, spacing, typography } from '../../src/theme';

type Session = {
  id: string;
  date: string;
  gym: string;
  durationMins: number;
  hardest: string;
  routes: number;
  notes?: string;
};

const SESSIONS: Session[] = [
  {
    id: '1',
    date: 'Today',
    gym: 'The Cliffs LIC',
    durationMins: 95,
    hardest: 'V5',
    routes: 11,
    notes: 'Worked the comp wall. Crimps felt good.',
  },
  {
    id: '2',
    date: 'Mon, May 25',
    gym: 'Brooklyn Boulders',
    durationMins: 75,
    hardest: 'V4',
    routes: 9,
  },
  {
    id: '3',
    date: 'Sat, May 23',
    gym: 'VITAL Brooklyn',
    durationMins: 120,
    hardest: 'V5',
    routes: 14,
    notes: 'New set. So many fun slabs.',
  },
];

export default function SessionsScreen() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
        <Text style={styles.subtitle}>Your climbing log.</Text>
      </View>

      <Card style={styles.summary}>
        <View style={styles.summaryRow}>
          <SummaryCell label="This week" value="3" unit="sessions" />
          <View style={styles.divider} />
          <SummaryCell label="Time on the wall" value="4.2h" unit="this week" />
        </View>
      </Card>

      <View style={styles.actionRow}>
        <Button label="Log a session" onPress={() => undefined} />
        <Button label="Scan route" variant="secondary" onPress={() => undefined} />
      </View>

      <View style={styles.list}>
        {SESSIONS.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </View>
    </Screen>
  );
}

const SummaryCell: React.FC<{ label: string; value: string; unit: string }> = ({
  label,
  value,
  unit,
}) => (
  <View style={styles.summaryCell}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryUnit}>{unit}</Text>
  </View>
);

const SessionCard: React.FC<{ session: Session }> = ({ session }) => (
  <Card>
    <View style={styles.sessionHeader}>
      <Text style={styles.sessionDate}>{session.date}</Text>
      <View style={styles.gradePill}>
        <Text style={styles.gradePillText}>{session.hardest}</Text>
      </View>
    </View>
    <Text style={styles.sessionGym}>{session.gym}</Text>
    <View style={styles.sessionMetaRow}>
      <Text style={styles.sessionMeta}>{session.durationMins} min</Text>
      <Text style={styles.sessionMetaDot}>·</Text>
      <Text style={styles.sessionMeta}>{session.routes} routes</Text>
    </View>
    {session.notes ? <Text style={styles.sessionNotes}>{session.notes}</Text> : null}
  </Card>
);

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing['2xl'],
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  summary: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCell: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryValue: {
    ...typography.h1,
    color: colors.text,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  summaryUnit: {
    ...typography.caption,
    color: colors.textSubtle,
    fontSize: 11,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  list: {
    gap: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sessionDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gradePill: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  gradePillText: {
    ...typography.bodyStrong,
    color: colors.accent,
    fontSize: 13,
  },
  sessionGym: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sessionMeta: {
    ...typography.body,
    color: colors.textMuted,
  },
  sessionMetaDot: {
    color: colors.textSubtle,
  },
  sessionNotes: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
