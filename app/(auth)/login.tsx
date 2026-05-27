import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { BrandMark } from '../../src/components/BrandMark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/theme';

export default function LoginScreen() {
  const { login, status, error, isConfigured } = useAuth();
  const isSubmitting = status === 'loading';

  return (
    <Screen scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BrandMark size="md" />
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>The climbing layer</Text>
        <Text style={styles.title}>Your climbing,{`\n`}all in one place.</Text>
        <Text style={styles.subtitle}>
          Track sessions, share sends, and grow with your tribe — across every gym
          you climb at.
        </Text>
      </View>

      <View style={styles.featureList}>
        <Feature
          title="Universal climber profile"
          description="A persistent identity that travels with you between gyms."
        />
        <Feature
          title="Progression you can feel"
          description="Sends, projects, and milestones — visualized over time."
        />
        <Feature
          title="Built around your tribe"
          description="Groups, gyms, and crews. The community side of climbing."
        />
      </View>

      <View style={styles.footer}>
        <Button
          label={isSubmitting ? 'Signing in…' : 'Continue with Auth0'}
          onPress={login}
          loading={isSubmitting}
          size="lg"
        />

        {!isConfigured ? (
          <Text style={styles.warning}>
            Heads up — Auth0 placeholders are still in{' '}
            <Text style={styles.code}>src/config/auth.ts</Text>. Set your domain
            + client ID to enable sign in.
          </Text>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.disclaimer}>
          By continuing, you agree to Bloc&apos;s Terms of Service and Privacy Policy.
        </Text>
      </View>
    </Screen>
  );
}

const Feature: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <View style={styles.feature}>
    <View style={styles.featureDot} />
    <View style={styles.featureCopy}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    gap: spacing['2xl'],
    flexGrow: 1,
  },
  header: {
    alignItems: 'flex-start',
  },
  hero: {
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    maxWidth: 360,
  },
  featureList: {
    gap: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  featureCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  featureTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  featureDescription: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
  warning: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
  },
  code: {
    fontFamily: 'Menlo',
    color: colors.warning,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
});
