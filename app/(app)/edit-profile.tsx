import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGyms, useProfile, useUpdateProfile } from '../../src/api/hooks';
import type { UpdateProfileInput } from '../../src/api/types';
import { Avatar } from '../../src/components/Avatar';
import { Chip } from '../../src/components/Chip';
import { Icon } from '../../src/components/Icon';
import {
  AVATAR_COLORS,
  GRADE_OPTIONS,
  STYLE_TAG_OPTIONS,
} from '../../src/profile/constants';
import { orange, radius, spacing, typography, useTheme, type SemanticColors } from '../../src/theme';

type FormState = {
  name: string;
  handle: string;
  bio: string;
  homeGymId: string | null;
  topGrade: string;
  avatarColor: string;
  styleTags: string[];
  privacy: 'public' | 'private';
  pictureUrl: string | null;
};

const emptyForm: FormState = {
  name: '',
  handle: '',
  bio: '',
  homeGymId: null,
  topGrade: 'V4',
  avatarColor: orange.main,
  styleTags: [],
  privacy: 'public',
  pictureUrl: null,
};

const profileToForm = (profile: NonNullable<ReturnType<typeof useProfile>['data']>): FormState => ({
  name: profile.name ?? '',
  handle: profile.handle ?? '',
  bio: profile.bio ?? '',
  homeGymId: profile.homeGym?.id ?? null,
  topGrade: profile.topGrade ?? 'V4',
  avatarColor: profile.avatarColor ?? orange.main,
  styleTags: profile.styleTags ?? [],
  privacy: profile.privacy ?? 'public',
  pictureUrl: profile.pictureUrl ?? null,
});

const formToPayload = (form: FormState): UpdateProfileInput => ({
  name: form.name.trim() || undefined,
  handle: form.handle.trim().replace(/^@/, '') || undefined,
  bio: form.bio.trim() || undefined,
  homeGymId: form.homeGymId ?? undefined,
  topGrade: form.topGrade || undefined,
  avatarColor: form.avatarColor,
  styleTags: form.styleTags,
  privacy: form.privacy,
  pictureUrl: form.pictureUrl,
});

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: profile, isLoading } = useProfile();
  const { data: gyms } = useGyms();
  const update = useUpdateProfile();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [baseline, setBaseline] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!profile) return;
    const next = profileToForm(profile);
    setForm(next);
    setBaseline(next);
  }, [profile]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(baseline),
    [form, baseline],
  );

  const selectedGym = gyms?.find((g) => g.id === form.homeGymId) ?? null;

  const patch = (partial: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag],
    }));
  };

  const cycleGym = () => {
    if (!gyms || gyms.length === 0) return;
    const idx = gyms.findIndex((g) => g.id === form.homeGymId);
    patch({ homeGymId: gyms[(idx + 1) % gyms.length].id });
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photos access needed',
        'Allow photo library access to set your profile picture.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.55,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (asset.base64) {
      const mime = asset.mimeType?.startsWith('image/') ? asset.mimeType : 'image/jpeg';
      patch({ pictureUrl: `data:${mime};base64,${asset.base64}` });
      return;
    }
    if (asset.uri) {
      patch({ pictureUrl: asset.uri });
    }
  };

  const removePhoto = () => patch({ pictureUrl: null });

  const save = () => {
    if (!dirty) {
      router.back();
      return;
    }

    update.mutate(formToPayload(form), {
      onSuccess: () => router.back(),
      onError: (err) =>
        Alert.alert(
          'Could not save',
          err instanceof Error ? err.message : 'Please try again.',
        ),
    });
  };

  const cancel = () => {
    if (dirty) {
      Alert.alert('Discard changes?', 'Your edits will be lost.', [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
      return;
    }
    router.back();
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top', 'bottom']}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  const initials = (form.name || form.handle || '?').charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={cancel} hitSlop={8} style={styles.topAction}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.topTitle}>Edit profile</Text>
        <Pressable
          onPress={save}
          disabled={!dirty || update.isPending}
          hitSlop={8}
          style={styles.topAction}
        >
          {update.isPending ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <Text
              style={[
                styles.doneText,
                (!dirty || update.isPending) && styles.doneDisabled,
              ]}
            >
              Done
            </Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.photoBlock}>
          <Avatar
            initials={initials}
            uri={form.pictureUrl ?? undefined}
            color={form.avatarColor}
            size={96}
          />
          <Pressable onPress={pickPhoto} style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change profile photo</Text>
          </Pressable>
          {form.pictureUrl ? (
            <Pressable onPress={removePhoto}>
              <Text style={styles.removePhotoText}>Remove photo</Text>
            </Pressable>
          ) : null}
        </View>

        <Field label="Name">
          <TextInput
            value={form.name}
            onChangeText={(name) => patch({ name })}
            placeholder="Your name"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            maxLength={120}
          />
        </Field>

        <Field label="Username">
          <View style={styles.handleRow}>
            <Text style={styles.handlePrefix}>@</Text>
            <TextInput
              value={form.handle}
              onChangeText={(handle) =>
                patch({ handle: handle.replace(/\s/g, '').toLowerCase() })
              }
              placeholder="climber"
              placeholderTextColor={colors.textSubtle}
              style={[styles.input, styles.handleInput]}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
            />
          </View>
        </Field>

        <Field label="Bio">
          <TextInput
            value={form.bio}
            onChangeText={(bio) => patch({ bio })}
            placeholder="Tell the tribe what you climb…"
            placeholderTextColor={colors.textSubtle}
            style={[styles.input, styles.bioInput]}
            multiline
            maxLength={150}
          />
          <Text style={styles.charCount}>{form.bio.length}/150</Text>
        </Field>

        <Field label="Home gym">
          <Pressable style={styles.selectRow} onPress={cycleGym}>
            <Icon name="business-outline" size={18} color={colors.textMuted} />
            <Text style={styles.selectText}>
              {selectedGym?.name ?? 'Select a gym'}
            </Text>
            <View style={{ flex: 1 }} />
            <Icon name="chevron-forward" size={16} color={colors.textSubtle} />
          </Pressable>
        </Field>

        <Field label="Peak grade">
          <View style={styles.chipWrap}>
            {GRADE_OPTIONS.map((grade) => (
              <Chip
                key={grade}
                label={grade}
                active={form.topGrade === grade}
                onPress={() => patch({ topGrade: grade })}
              />
            ))}
          </View>
        </Field>

        <Field label="Climbing style">
          <View style={styles.chipWrap}>
            {STYLE_TAG_OPTIONS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                active={form.styleTags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </Field>

        {!form.pictureUrl ? (
          <Field label="Avatar color">
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => patch({ avatarColor: color })}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    form.avatarColor === color && styles.colorSwatchActive,
                  ]}
                />
              ))}
            </View>
          </Field>
        ) : null}

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchLabel}>Private account</Text>
            <Text style={styles.switchHint}>
              Only approved followers see your sends and sessions.
            </Text>
          </View>
          <Switch
            value={form.privacy === 'private'}
            onValueChange={(on) =>
              patch({ privacy: on ? 'private' : 'public' })
            }
            trackColor={{ false: colors.surfaceMuted, true: colors.accentMuted }}
            thumbColor={form.privacy === 'private' ? colors.accent : colors.textSubtle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
};

const createStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    topAction: {
      width: 72,
      alignItems: 'center',
    },
    topTitle: {
      ...typography.bodyStrong,
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    cancelText: {
      ...typography.body,
      color: colors.text,
    },
    doneText: {
      ...typography.bodyStrong,
      color: colors.accent,
    },
    doneDisabled: {
      opacity: 0.35,
    },
    scroll: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing['3xl'],
    },
    photoBlock: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing['2xl'],
    },
    changePhotoBtn: {
      marginTop: spacing.sm,
    },
    changePhotoText: {
      ...typography.bodyStrong,
      color: colors.accent,
    },
    removePhotoText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    field: {
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    fieldLabel: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '600',
    },
    input: {
      ...typography.body,
      color: colors.text,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    handleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingLeft: spacing.lg,
    },
    handlePrefix: {
      ...typography.body,
      color: colors.textMuted,
    },
    handleInput: {
      flex: 1,
      borderWidth: 0,
      backgroundColor: 'transparent',
      paddingLeft: spacing.xs,
    },
    bioInput: {
      minHeight: 96,
      textAlignVertical: 'top',
      paddingTop: spacing.md,
    },
    charCount: {
      ...typography.caption,
      color: colors.textSubtle,
      textAlign: 'right',
    },
    selectRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    selectText: {
      ...typography.body,
      color: colors.text,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    colorRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    colorSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorSwatchActive: {
      borderColor: colors.text,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      paddingVertical: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      marginTop: spacing.sm,
    },
    switchCopy: {
      flex: 1,
      gap: 4,
    },
    switchLabel: {
      ...typography.bodyStrong,
      color: colors.text,
    },
    switchHint: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
