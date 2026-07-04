import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { GradeChip } from '../src/components/GradeChip';
import { Icon } from '../src/components/Icon';
import { NavHeader } from '../src/components/NavHeader';
import { Screen } from '../src/components/Screen';
import { gradeColor, colors, radius, spacing, typography } from '../src/theme';
import { sessions, type Session } from '../src/data/mock';

export default function SessionsScreen() {
  const router = useRouter();

  return (
    <Screen scroll edges={['top']}>
      <NavHeader title="Your logbook" />

      <Card style={styles.summary}>
        <SummaryCell label="This week" value="3" unit="sessions" />
        <View style={styles.summaryDivider} />
        <SummaryCell label="On the wall" value="4.2h" unit="this week" />
        <View style={styles.summaryDivider} />
        <SummaryCell label="Flash rate" value="38%" unit="last 10" />
      </Card>

      <View style={styles.list}>
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onPress={() => router.push('/log')}
          />
        ))}
      </View>
      <View style={styles.bottomSpace} />
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

const SessionCard: React.FC<{ session: Session; onPress: () => void }> = ({
  session,
}) => {
  const totalSends = session.grades.reduce((sum, g) => sum + g.count, 0);
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.date}>{session.date}</Text>
          <Text style={styles.gym}>{session.gym}</Text>
        </View>
        <GradeChip grade={session.hardest} size="lg" />
      </View>

      <View style={styles.metaRow}>
        <Meta icon="time-outline" text={`${session.durationMins} min`} />
        <Meta icon="checkmark-circle-outline" text={`${session.sends} sends`} />
        <Meta icon="flash-outline" text={`${session.flashes} flashes`} />
      </View>

      <View style={styles.gradeBar}>
        {session.grades.map((g) => (
          <View
            key={g.grade}
            style={{
              flex: g.count,
              height: 8,
              backgroundColor: gradeColor(g.grade),
            }}
          />
        ))}
      </View>
      <View style={styles.gradeLegend}>
        {session.grades.map((g) => (
          <View key={g.grade} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: gradeColor(g.grade) }]} />
            <Text style={styles.legendText}>
              {g.grade} · {g.count}
            </Text>
          </View>
        ))}
        <Text style={styles.legendTotal}>{totalSends} sends</Text>
      </View>

      {session.note ? <Text style={styles.note}>{session.note}</Text> : null}
    </Card>
  );
};

const Meta: React.FC<{ icon: React.ComponentProps<typeof Icon>['name']; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.meta}>
    <Icon name={icon} size={15} color={colors.textMuted} />
    <Text style={styles.metaText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    ...typography.h1,
    fontSize: 24,
    color: colors.text,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  summaryUnit: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSubtle,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: colors.border,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gym: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gradeBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
    gap: 2,
  },
  gradeLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  legendTotal: {
    ...typography.caption,
    color: colors.textSubtle,
    marginLeft: 'auto',
  },
  note: {
    ...typography.body,
    color: colors.textMuted,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  bottomSpace: {
    height: spacing['2xl'],
  },
});
