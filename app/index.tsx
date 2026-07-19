import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../src/auth/AuthContext';
import { useTheme } from '../src/theme';

export default function Index() {
  const { status } = useAuth();
  const { colors } = useTheme();

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
