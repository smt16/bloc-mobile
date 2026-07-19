import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { BrandMark } from '../../src/components/BrandMark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import {
  AuthFooterLink,
  SocialAuthButtons,
} from '../../src/components/SocialAuthButtons';
import { TextField } from '../../src/components/TextField';
import { fonts } from '../../src/theme';

export default function SignupScreen() {
  const router = useRouter();
  const {
    registerWithPassword,
    loginWithGoogle,
    loginWithApple,
    error,
    clearError,
    isConfigured,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState<'password' | 'social' | null>(
    null,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const busy = submitting !== null;

  const onRegister = async () => {
    clearError();
    setFieldError(null);

    const trimmed = email.trim();
    if (!trimmed || !password) {
      setFieldError('Email and password are required.');
      return;
    }
    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setFieldError('Passwords do not match.');
      return;
    }

    setSubmitting('password');
    try {
      await registerWithPassword(trimmed, password);
    } catch {
      // Error surfaced via AuthContext.error
    } finally {
      setSubmitting(null);
    }
  };

  const onSocial = async (provider: 'google' | 'apple') => {
    clearError();
    setFieldError(null);
    setSubmitting('social');
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithApple();
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <Screen scroll padded={false} className="px-xl">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 justify-between gap-2xl py-2xl">
          <View className="gap-2xl">
            <View className="items-center gap-lg">
              <BrandMark size="lg" />
              <View className="items-center gap-sm">
                <Text
                  className="uppercase text-text"
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 40,
                    lineHeight: 40,
                    letterSpacing: 1.2,
                  }}
                >
                  Create an account
                </Text>
                <Text className="text-center text-body text-text-muted">
                  One climber ID. Gym to gym. No corporate passport.
                </Text>
              </View>
            </View>

            <View className="gap-lg">
              <TextField
                label="Email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setFieldError(null);
                }}
                placeholder="you@crag.mail"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                editable={!busy}
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setFieldError(null);
                }}
                placeholder="At least 8 characters"
                secureToggle
                textContentType="newPassword"
                autoComplete="new-password"
                editable={!busy}
              />
              <TextField
                label="Confirm password"
                value={confirm}
                onChangeText={(v) => {
                  setConfirm(v);
                  setFieldError(null);
                }}
                placeholder="••••••••"
                secureToggle
                textContentType="newPassword"
                autoComplete="new-password"
                editable={!busy}
                onSubmitEditing={() => {
                  void onRegister();
                }}
                returnKeyType="go"
              />

              {(fieldError || error) && (
                <Text className="text-center text-caption text-danger">
                  {fieldError ?? error}
                </Text>
              )}

              <Button
                label={submitting === 'password' ? 'Creating…' : 'Continue'}
                onPress={() => {
                  void onRegister();
                }}
                loading={submitting === 'password'}
                disabled={busy}
                size="lg"
              />

              <SocialAuthButtons
                onGoogle={() => {
                  void onSocial('google');
                }}
                onApple={() => {
                  void onSocial('apple');
                }}
                loading={submitting === 'social'}
                disabled={busy}
              />

              {!isConfigured ? (
                <Text className="text-center text-caption text-warning">
                  Social sign-in needs Auth0 domain + client ID in{' '}
                  <Text className="font-mono text-warning">src/config/auth.ts</Text>
                  .
                </Text>
              ) : null}
            </View>
          </View>

          <View className="gap-md">
            <AuthFooterLink
              prompt="Already have an account?"
              actionLabel="Log in"
              onPress={() => router.replace('/(auth)/login')}
            />
            <Text
              className="text-center uppercase text-text-subtle"
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 0.8,
              }}
            >
              By continuing you agree to the Terms. Break a rule, break a hold.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
