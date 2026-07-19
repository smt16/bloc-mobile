import React from 'react';
import { Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { BrandMark } from '../../src/components/BrandMark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';

export default function LoginScreen() {
  const { login, status, error, isConfigured } = useAuth();
  const isSubmitting = status === 'loading';

  return (
    <Screen padded={false} className="px-xl py-2xl">
      <View className="flex-1 justify-between">
        <View className="gap-xl">
          <View className="items-start">
            <BrandMark size="md" />
          </View>

          <View className="gap-md">
            <Text className="text-overline uppercase text-accent">The climbing layer</Text>
            <Text className="text-display text-text">Your climbing,{`\n`}all in one place.</Text>
            <Text className="max-w-[360px] text-body text-text-muted">
              Track sessions, share sends, and grow with your tribe — across every gym
              you climb at.
            </Text>
          </View>

          <View className="gap-lg">
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
        </View>

        <View className="gap-md">
          <Button
            label={isSubmitting ? 'Signing in…' : 'Continue with Auth0'}
            onPress={login}
            loading={isSubmitting}
            size="lg"
          />

          {!isConfigured ? (
            <Text className="text-center text-caption text-warning">
              Heads up — Auth0 placeholders are still in{' '}
              <Text className="font-[Menlo] text-warning">src/config/auth.ts</Text>. Set your
              domain + client ID to enable sign in.
            </Text>
          ) : null}

          {error ? <Text className="text-center text-caption text-danger">{error}</Text> : null}

          <Text className="text-center text-caption text-text-subtle">
            By continuing, you agree to Bloc&apos;s Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const Feature: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <View className="flex-row gap-md">
    <View className="mt-2 h-2 w-2 rounded-full bg-accent" />
    <View className="flex-1 gap-xs">
      <Text className="text-body-strong text-text">{title}</Text>
      <Text className="text-body text-text-muted">{description}</Text>
    </View>
  </View>
);
