import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGyms, useLogClimb, useProfile } from '../src/api/hooks';
import type { ClimbOutcome } from '../src/api/types';
import { Button } from '../src/components/Button';
import { Icon, type IconName } from '../src/components/Icon';
import { NavHeader } from '../src/components/NavHeader';
import { gradeColor, gradients, radius, spacing, typography, useTheme, type SemanticColors } from '../src/theme';

const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'];

export default function LogScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const outcomes = useMemo(
    (): { key: ClimbOutcome; label: string; icon: IconName; color: string }[] => [
      { key: 'flash', label: 'Flash', icon: 'flash', color: colors.cyan },
      { key: 'send', label: 'Send', icon: 'trophy', color: colors.success },
      { key: 'project', label: 'Project', icon: 'construct', color: colors.warning },
    ],
    [colors],
  );
  const params = useLocalSearchParams<{ routeId?: string; grade?: string }>();
  const { data: gyms } = useGyms();
  const { data: profile } = useProfile();
  const logClimb = useLogClimb();

  const [grade, setGrade] = useState(params.grade ?? 'V4');
  const [outcome, setOutcome] = useState<ClimbOutcome>('send');
  const [attempts, setAttempts] = useState(1);
  const [note, setNote] = useState('');
  const [gymId, setGymId] = useState<string | null>(null);

  const resolvedGymId =
    gymId ?? profile?.homeGym?.id ?? gyms?.[0]?.id ?? null;
  const selectedGym = gyms?.find((g) => g.id === resolvedGymId) ?? null;

  const cycleGym = () => {
    if (!gyms || gyms.length === 0) return;
    const idx = gyms.findIndex((g) => g.id === resolvedGymId);
    setGymId(gyms[(idx + 1) % gyms.length].id);
  };

  const submit = () => {
    logClimb.mutate(
      {
        grade,
        outcome,
        attempts,
        note: note.trim() || undefined,
        gymId: resolvedGymId ?? undefined,
        routeId: params.routeId,
      },
      {
        onSuccess: () => router.back(),
        onError: () =>
          Alert.alert('Could not log climb', 'Please try again.'),
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerPad}>
        <NavHeader title="Log a climb" variant="close" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanCard}
          >
            <View style={styles.scanFrame}>
              <Icon name="qr-code-outline" size={40} color={colors.bg} />
            </View>
            <Text style={styles.scanTitle}>Scan route QR</Text>
            <Text style={styles.scanSub}>Point at the tag on the wall to auto-fill.</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or log manually</Text>
          <View style={styles.orLine} />
        </View>

        <Text style={styles.label}>Grade</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradeRow}
        >
          {GRADES.map((g) => {
            const active = grade === g;
            const color = gradeColor(g);
            return (
              <Pressable
                key={g}
                onPress={() => setGrade(g)}
                style={[
                  styles.gradePill,
                  {
                    backgroundColor: active ? color : colors.surface,
                    borderColor: active ? color : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gradePillText,
                    { color: active ? colors.bg : colors.textMuted },
                  ]}
                >
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Outcome</Text>
        <View style={styles.outcomeRow}>
          {outcomes.map((o) => {
            const active = outcome === o.key;
            return (
              <Pressable
                key={o.key}
                onPress={() => setOutcome(o.key)}
                style={[
                  styles.outcome,
                  active && { backgroundColor: `${o.color}1F`, borderColor: o.color },
                ]}
              >
                <Icon name={o.icon} size={22} color={active ? o.color : colors.textMuted} />
                <Text style={[styles.outcomeText, active && { color: o.color }]}>
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Attempts</Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setAttempts((a) => Math.max(1, a - 1))}
            style={styles.stepBtn}
          >
            <Icon name="remove" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.stepValue}>{attempts}</Text>
          <Pressable onPress={() => setAttempts((a) => a + 1)} style={styles.stepBtn}>
            <Icon name="add" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.label}>Gym</Text>
        <Pressable style={styles.selectRow} onPress={cycleGym}>
          <Icon name="business-outline" size={18} color={colors.textMuted} />
          <Text style={styles.selectText}>
            {selectedGym?.name ?? 'Select gym'}
          </Text>
          <View style={{ flex: 1 }} />
          <Icon name="chevron-forward" size={18} color={colors.textSubtle} />
        </Pressable>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="How did it feel? Beta, conditions…"
          placeholderTextColor={colors.textSubtle}
          multiline
          style={styles.notes}
        />

        <Pressable style={styles.mediaAdd}>
          <Icon name="videocam-outline" size={20} color={colors.accent} />
          <Text style={styles.mediaAddText}>Add a send clip</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Log climb"
          size="lg"
          loading={logClimb.isPending}
          onPress={submit}
          leading={<Icon name="checkmark" size={20} color={colors.accentText} />}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    headerPad: {
      paddingHorizontal: spacing.xl,
    },
    content: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing['2xl'],
      gap: spacing.sm,
    },
    scanCard: {
      borderRadius: radius.xl,
      padding: spacing.xl,
      alignItems: 'center',
      gap: 6,
      marginTop: spacing.sm,
    },
    scanFrame: {
      width: 76,
      height: 76,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: 'rgba(11,11,15,0.4)',
      backgroundColor: 'rgba(11,11,15,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    scanTitle: {
      ...typography.h2,
      color: colors.bg,
    },
    scanSub: {
      ...typography.caption,
      color: 'rgba(11,11,15,0.72)',
      fontWeight: '600',
      textAlign: 'center',
    },
    orRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginVertical: spacing.lg,
    },
    orLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    orText: {
      ...typography.caption,
      color: colors.textSubtle,
    },
    label: {
      ...typography.overline,
      color: colors.textMuted,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    gradeRow: {
      gap: spacing.sm,
      paddingVertical: 2,
    },
    gradePill: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gradePillText: {
      ...typography.bodyStrong,
      fontWeight: '800',
    },
    outcomeRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    outcome: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    outcomeText: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '700',
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    stepBtn: {
      width: 48,
      height: 44,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepValue: {
      ...typography.h2,
      color: colors.text,
    },
    selectRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      height: 52,
    },
    selectText: {
      ...typography.body,
      color: colors.text,
    },
    notes: {
      ...typography.body,
      color: colors.text,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      minHeight: 88,
      textAlignVertical: 'top',
    },
    mediaAdd: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.borderStrong,
      paddingVertical: spacing.lg,
      marginTop: spacing.lg,
    },
    mediaAddText: {
      ...typography.bodyStrong,
      color: colors.accent,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
  });
